package com.korea.trip.service;

import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.korea.trip.dto.BusInfo;
import com.korea.trip.dto.KorailInfo;
import com.korea.trip.dto.TransportRequest;
import com.korea.trip.dto.TransportResult;
import com.korea.trip.dto.TerminalInfo;
import com.korea.trip.util.BusUtil;
import com.korea.trip.util.KorailUtil;
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
        this.busTerminalMap = busUtil.fetchTerminalMap();
        System.out.println("버스터미널 목록: " + busTerminalMap.keySet());

        this.korailStationMap = korailUtil.getCityStationMap();
        System.out.println("코레일 역 목록: " + korailStationMap.keySet());
    }

    public TransportResult recommendTransport(TransportRequest request) {
        // 출발지, 도착지 도시명 정규화
        String depCity = korailUtil.simplifyCityName(request.getDeparture());
        String arrCity = korailUtil.simplifyCityName(request.getArrival());
        String date = formatDate(request.getDate());

        System.out.println("요청 출발 도시 (정규화): " + depCity);
        System.out.println("요청 도착 도시 (정규화): " + arrCity);
        System.out.println("요청 날짜: " + date);

        // 🚌 버스
        List<String> busDepIds = busUtil.getTerminalIdsByCity(depCity);
        List<String> busArrIds = busUtil.getTerminalIdsByCity(arrCity);

        List<BusInfo> busResults = new ArrayList<>();
        for (String depId : busDepIds) {
            for (String arrId : busArrIds) {
                busResults.addAll(busUtil.fetchBus(depId, arrId, date));
            }
        }

        List<String> busList = busResults.stream()
            .filter(bus -> bus.getDepPlandTime().length() >= 12 && bus.getArrPlandTime().length() >= 12)
            .map(bus -> String.format("%s | %s → %s | %d원 | %s → %s",
                bus.getGradeNm(),
                bus.getDepPlaceNm(),
                bus.getArrPlaceNm(),
                bus.getCharge(),
                bus.getDepPlandTime().substring(8, 12),
                bus.getArrPlandTime().substring(8, 12)))
            .toList();

        // 🚄 코레일 - 주요역 목록 가져오기
        List<StationInfo> depStations = korailUtil.getMajorStationsByCityKeyword(depCity);
        List<StationInfo> arrStations = korailUtil.getMajorStationsByCityKeyword(arrCity);

        System.out.println("출발지 주요역 목록: " + depStations);
        System.out.println("도착지 주요역 목록: " + arrStations);

        List<KorailInfo> korailResults = new ArrayList<>();

        // 역별로 API 호출
        for (StationInfo depStation : depStations) {
            for (StationInfo arrStation : arrStations) {
                System.out.printf("코레일 API 호출 예정: 출발역 %s(%s) → 도착역 %s(%s), 날짜 %s\n",
                    depStation.getStationName(), depStation.getStationCode(),
                    arrStation.getStationName(), arrStation.getStationCode(),
                    date);

                List<KorailInfo> results = korailUtil.fetchKorail(depStation.getStationCode(), arrStation.getStationCode(), date);

                if (results.isEmpty()) {
                    System.out.println("→ 해당 경로에 대한 열차 정보 없음");
                } else {
                    System.out.println("→ 조회된 열차 정보 수: " + results.size());
                    for (KorailInfo info : results) {
                        System.out.println("   " + info);
                    }
                }

                korailResults.addAll(results);
            }
        }

        // 결과 스트림 가공
        List<String> korailList = korailResults.stream()
            .filter(train -> train.getDepPlandTime().length() >= 12 && train.getArrPlandTime().length() >= 12)
            .map(train -> String.format("%s | %s역 → %s역 | %s → %s | %d원",
                train.getTrainGrade(),
                train.getDepStationName(),
                train.getArrStationName(),
                train.getDepPlandTime().substring(8, 12),
                train.getArrPlandTime().substring(8, 12),
                train.getAdultcharge()))
            .toList();

        // 결과 반환
        TransportResult result = new TransportResult();
        result.setBusOptions(busList.isEmpty() ? List.of("해당 날짜에 버스 정보가 없습니다.") : busList);
        result.setKorailOptions(korailList.isEmpty() ? List.of("해당 날짜에 열차 정보가 없습니다.") : korailList);

        return result;
    }

    private String formatDate(String rawDate) {
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDate date = LocalDate.parse(rawDate, inputFormatter);
        return date.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    }
}
