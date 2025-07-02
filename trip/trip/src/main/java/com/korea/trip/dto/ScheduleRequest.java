package com.korea.trip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleRequest {
	private String departure;
    private String arrival;
    private String date; // yyyy-MM-dd
    private int days; // 여행 기간 (ex 3)
}
