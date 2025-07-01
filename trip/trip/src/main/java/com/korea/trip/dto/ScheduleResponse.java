package com.korea.trip.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponse {
	private String title;
    private String date;
    private List<PlaceDto> places;
}

