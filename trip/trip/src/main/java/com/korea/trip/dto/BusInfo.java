package com.korea.trip.dto;

import lombok.Data;

@Data
public class BusInfo {
    private String gradeNm; //버스 등급명
    private String routeId; //버스 노선 ID
    private String depPlaceNm; //출발역
    private String depPlandTime; //출발시간
    private String arrPlaceNm; //도착역
    private String arrPlandTiem; //도착시간
    private int charge; //버스 요금
}
