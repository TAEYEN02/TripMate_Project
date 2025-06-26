package com.korea.trip.dto;

import lombok.Data;

@Data
public class TrainInfo {
    private String trainGradeName; //열차 등급명
    private String trainNo; //열차 번호
    private String depPlaceName; //출발역
    private String arrPlaceName; //도착역
    private String depPlandTime; //출발시간
    private String arrPlandTime; //도착시간
    private int adultCharge; //요금(어른기준)
}