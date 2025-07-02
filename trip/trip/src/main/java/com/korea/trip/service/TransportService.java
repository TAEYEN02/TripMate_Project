package com.korea.trip.service;


import jakarta.annotation.PostConstruct;

@Service
public class TransportService {

    private final KorailUtil korailUtil;
    private final BusUtil busUtil;


    public TransportService(KorailUtil korailUtil, BusUtil busUtil) {
        this.korailUtil = korailUtil;
        this.busUtil = busUtil;
    }

    @PostConstruct
    public void init() {


        System.out.println("요청 출발 도시 (정규화): " + depCity);
        System.out.println("요청 도착 도시 (정규화): " + arrCity);
        System.out.println("요청 날짜: " + date);


        List<BusInfo> busResults = new ArrayList<>();
        for (String depId : busDepIds) {
            for (String arrId : busArrIds) {
                busResults.addAll(busUtil.fetchBus(depId, arrId, date));
            }
        }

        List<String> busList = busResults.stream()

            .map(bus -> String.format("%s | %s → %s | %d원 | %s → %s",
                bus.getGradeNm(),
                bus.getDepPlaceNm(),
                bus.getArrPlaceNm(),
                bus.getCharge(),

            .map(train -> String.format("%s | %s역 → %s역 | %s → %s | %d원",
                train.getTrainGrade(),
                train.getDepStationName(),
                train.getArrStationName(),

        TransportResult result = new TransportResult();
        result.setBusOptions(busList.isEmpty() ? List.of("해당 날짜에 버스 정보가 없습니다.") : busList);
        result.setKorailOptions(korailList.isEmpty() ? List.of("해당 날짜에 열차 정보가 없습니다.") : korailList);

        return result;
    }

    private String formatDate(String rawDate) {
