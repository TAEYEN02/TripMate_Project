package com.korea.trip.service;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

import com.korea.trip.dto.TransportRequest;
import com.korea.trip.dto.TransportResult;
import com.korea.trip.util.BusUtil;
import com.korea.trip.util.KorailUtil;

import jakarta.annotation.PostConstruct;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;



@Service
public class TransportService {

    private final KorailUtil korailUtil;
    private final BusUtil busUtil;

    private Map<String, String> busTerminalMap;
    private Map<String, String> korailStationMap;

    public TransportService(KorailUtil korailUtil, BusUtil busUtil) {
        this.korailUtil = korailUtil;
        this.busUtil = busUtil;
    }

    @PostConstruct
    public void init() {
        this.busTerminalMap = busUtil.fetchTerminalCodeMap();
        System.out.println("버스터미널 목록: " + busTerminalMap);
        this.korailStationMap = korailUtil.fetchStationCodeMap();
        System.out.println("코레일 역 목록: " + korailStationMap);
    }

    public TransportResult recommendTransport(TransportRequest request) {
        String busDep = getBusCode(request.getDeparture());
        String busArr = getBusCode(request.getArrival());
        String korailDep = getTrainCode(request.getDeparture());
        String korailArr = getTrainCode(request.getArrival());

        List<String> korail = korailUtil.fetchKorail(korailDep, korailArr, formatDate(request.getDate()));
        List<String> bus = busUtil.fetchBus(busDep, busArr, formatDate(request.getDate()));

        System.out.printf("코드 변환: 버스 출발[%s], 버스 도착[%s], 열차 출발[%s], 열차 도착[%s]%n",
                busDep, busArr, korailDep, korailArr);

        
        
        TransportResult result = new TransportResult();
        result.setKorailOptions(korail == null || korail.isEmpty() ? List.of("해당 날짜에 운행 정보가 없습니다.") : korail);
        result.setBusOptions(bus == null || bus.isEmpty() ? List.of("해당 날짜에 운행 정보가 없습니다.") : bus);

        return result;
    }

    private String getBusCode(String cityName) {
        return busTerminalMap.getOrDefault(cityName, cityName);
    }

    private String getTrainCode(String cityName) {
    	String code = korailStationMap.get(cityName);
        System.out.println("getTrainCode: " + cityName + " -> " + code);
        return code != null ? code : cityName;
    }

    private String formatDate(String rawDate) {
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDate date = LocalDate.parse(rawDate, inputFormatter);
        // 만약 출력도 yyyyMMdd 형식이면 그대로 반환
        return date.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    }
}
