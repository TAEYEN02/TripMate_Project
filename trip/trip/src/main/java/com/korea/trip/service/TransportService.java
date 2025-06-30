package com.korea.trip.service;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.korea.trip.dto.*;
import com.korea.trip.util.*;
import jakarta.annotation.PostConstruct;

@Service
public class TransportService {

    private final KorailUtil korailUtil;
    private final BusUtil busUtil;


    // Map 필드 제거 (초기화 시점 문제 해결)
    public TransportService(KorailUtil korailUtil, BusUtil busUtil) {
        this.korailUtil = korailUtil;
        this.busUtil = busUtil;
    }

    @PostConstruct
    public void init() {
        // 초기화 시점 조정
        System.out.println("버스터미널 목록: " + busUtil.getCityTerminalMap().keySet());
        System.out.println("코레일 역 목록: " + korailUtil.getCityStationMap().keySet());
    }

    public TransportResult recommendTransport(TransportRequest request) {
        String depCity = korailUtil.simplifyCityName(request.getDeparture());
        String arrCity = korailUtil.simplifyCityName(request.getArrival());
        String date = formatDate(request.getDate());
        String timeRangeStr = request.getTimeRange();

        final TimeRange timeRange = TimeRange.fromString(timeRangeStr);

        System.out.println("요청 출발 도시 (정규화): " + depCity);
        System.out.println("요청 도착 도시 (정규화): " + arrCity);
        System.out.println("요청 날짜: " + date);
        System.out.println("요청 시간대: " + timeRange);

        // 버스 터미널 ID 조회
        List<TerminalInfo> depTerminals = busUtil.getTerminalsByCityKeyword(depCity);
        List<TerminalInfo> arrTerminals = busUtil.getTerminalsByCityKeyword(arrCity);
        
        List<String> busDepIds = depTerminals.stream()
            .map(TerminalInfo::getTerminalId)
            .toList();
            
        List<String> busArrIds = arrTerminals.stream()
            .map(TerminalInfo::getTerminalId)
            .toList();

        List<BusInfo> busResults = new ArrayList<>();
        for (String depId : busDepIds) {
            for (String arrId : busArrIds) {
                busResults.addAll(busUtil.fetchBus(depId, arrId, date));
            }
        }

        List<String> busList = busResults.stream()
            .filter(bus -> bus.getDepPlandTime() != null && bus.getDepPlandTime().length() >= 12)
            .filter(bus -> isInTimeRange(bus.getDepPlandTime(), timeRange))
            .map(bus -> String.format("%s | %s → %s | %d원 | %s → %s",
                bus.getGradeNm(),
                bus.getDepPlaceNm(),
                bus.getArrPlaceNm(),
                bus.getCharge(),
                formatTime(bus.getDepPlandTime()),
                formatTime(bus.getArrPlandTime())))
            .toList();

        // 기차 처리 로직 (변경 없음)
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

        List<String> korailList = korailResults.stream()
            .filter(train -> train.getDepPlandTime() != null && train.getDepPlandTime().length() >= 12)
            .filter(train -> isInTimeRange(train.getDepPlandTime(), timeRange))
            .map(train -> String.format("%s | %s역 → %s역 | %s → %s | %d원",
                train.getTrainGrade(),
                train.getDepStationName(),
                train.getArrStationName(),
                formatTime(train.getDepPlandTime()),
                formatTime(train.getArrPlandTime()),
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

    // 시간 문자열에서 HHmm 추출 (예: "202406301200" -> "1200")
    private String formatTime(String fullTime) {
        return (fullTime != null && fullTime.length() >= 12) 
            ? fullTime.substring(8, 12) 
            : "0000";
    }

    // 시간대 필터링 (HHmm 형식 사용)
    private boolean isInTimeRange(String timeStr, TimeRange timeRange) {
        if (timeRange == null) return true;
        String timePart = formatTime(timeStr);
        return timeRange.isInRange(timePart);
    }
}
