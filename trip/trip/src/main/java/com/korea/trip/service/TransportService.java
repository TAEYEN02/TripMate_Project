package com.korea.trip.service;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.korea.trip.dto.BusInfo;
import com.korea.trip.dto.KorailInfo;
import com.korea.trip.dto.TransportRequest;
import com.korea.trip.dto.TransportResult;
import com.korea.trip.dto.TerminalInfo;
import com.korea.trip.util.BusUtil;
import com.korea.trip.util.KorailUtil;
import com.korea.trip.util.TimeRange;
import com.korea.trip.dto.StationInfo;

import jakarta.annotation.PostConstruct;

@Service
public class TransportService {

    private final KorailUtil korailUtil;
    private final BusUtil busUtil;

    private Map<String, List<TerminalInfo>> busTerminalMap;
    private Map<String, List<StationInfo>> korailStationMap;

    public TransportService(KorailUtil korailUtil, BusUtil busUtil) {
        this.korailUtil = korailUtil;
        this.busUtil = busUtil;
    }

    @PostConstruct
    public void init() {
        this.busTerminalMap = busUtil.fetchCityTerminalMap();
        System.out.println("버스터미널 목록: " + busTerminalMap.keySet());

        this.korailStationMap = korailUtil.getCityStationMap();
        System.out.println("코레일 역 목록: " + korailStationMap.keySet());
    }

    public TransportResult recommendTransport(TransportRequest request) {
        String depCity = korailUtil.simplifyCityName(request.getDeparture());
        String arrCity = korailUtil.simplifyCityName(request.getArrival());
        String date = formatDate(request.getDate());
        String timeRangeStr = request.getTimeRange();

        final TimeRange timeRange = TimeRange.fromString(timeRangeStr); // enum 변환 메서드 사용

        System.out.println("요청 출발 도시 (정규화): " + depCity);
        System.out.println("요청 도착 도시 (정규화): " + arrCity);
        System.out.println("요청 날짜: " + date);
        System.out.println("요청 시간대: " + timeRange);

        List<String> busDepIds = busUtil.getTerminalIdsByCity(depCity);
        List<String> busArrIds = busUtil.getTerminalIdsByCity(arrCity);

        List<BusInfo> busResults = new ArrayList<>();
        for (String depId : busDepIds) {
            for (String arrId : busArrIds) {
                busResults.addAll(busUtil.fetchBus(depId, arrId, date, timeRange));
            }
        }

        List<String> busList = busResults.stream()
            .filter(bus -> bus.getDepPlandTime().length() >= 12 && bus.getArrPlandTime().length() >= 12)
            .filter(bus -> isInTimeRange(bus.getDepPlandTime(), timeRange))
            .map(bus -> String.format("%s | %s → %s | %d원 | %s → %s",
                bus.getGradeNm(),
                bus.getDepPlaceNm(),
                bus.getArrPlaceNm(),
                bus.getCharge(),
                bus.getDepPlandTime().substring(8, 12),
                bus.getArrPlandTime().substring(8, 12)))
            .toList();

        List<StationInfo> depStations = korailUtil.getMajorStationsByCityKeyword(depCity);
        List<StationInfo> arrStations = korailUtil.getMajorStationsByCityKeyword(arrCity);

        List<CompletableFuture<List<KorailInfo>>> futureList = new ArrayList<>();

        for (StationInfo dep : depStations) {
            for (StationInfo arr : arrStations) {
                CompletableFuture<List<KorailInfo>> future =
                    korailUtil.fetchKorailAsync(dep.getStationCode(), arr.getStationCode(), date, timeRange);
                futureList.add(future);
            }
        }

        CompletableFuture<Void> allDone = CompletableFuture.allOf(futureList.toArray(new CompletableFuture[0]));
        allDone.join();

        List<KorailInfo> korailResults = futureList.stream()
            .map(CompletableFuture::join)
            .flatMap(List::stream)
            .collect(Collectors.toList());

        if (korailResults.isEmpty()) {
            korailResults.add(new KorailInfo("해당 날짜에 열차 정보가 없습니다.", "", "", "", "", "", 0));
        }

        List<String> korailList = korailResults.stream()
            .filter(train -> train.getDepPlandTime().length() >= 12 && train.getArrPlandTime().length() >= 12)
            .filter(train -> isInTimeRange(train.getDepPlandTime(), timeRange))
            .map(train -> String.format("%s | %s역 → %s역 | %s → %s | %d원",
                train.getTrainGrade(),
                train.getDepStationName(),
                train.getArrStationName(),
                train.getDepPlandTime().substring(8, 12),
                train.getArrPlandTime().substring(8, 12),
                train.getAdultcharge()))
            .toList();

        TransportResult result = new TransportResult();
        result.setBusOptions(busList.isEmpty() ? List.of("해당 날짜에 버스 정보가 없습니다.") : busList);
        result.setKorailOptions(korailList.isEmpty() ? List.of("해당 날짜에 열차 정보가 없습니다.") : korailList);

        return result;
    }

    private String formatDate(String rawDate) {
        LocalDate date = LocalDate.parse(rawDate);
        return date.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    }

    private boolean isInTimeRange(String timeStr, TimeRange timeRange) {
        if (timeRange == null) return true;
        return timeRange.isInRange(timeStr);
    }
}
