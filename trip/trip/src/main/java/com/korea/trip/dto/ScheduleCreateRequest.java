package com.korea.trip.dto;

import lombok.Data;

@Data
public class ScheduleCreateRequest {
    private String departure;
    private String arrival;
    private String date;
    private String transportType; // 예: "korail" or "bus"
}
