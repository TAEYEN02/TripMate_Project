package com.korea.trip.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.trip.models.Place;
import com.korea.trip.models.Schedule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDTO {

    private Long id;
    private String title;
    private String description;
    private String date;
    private boolean isPublic;

    // 필요 시 추가: 시간, 장소 정보 등
    private List<Place> places;

    // 유저 정보 일부 포함 가능
    private String userId;
    private String username;

    public static ScheduleDTO fromEntity(Schedule schedule) {
    	
    	  List<Place> placeList = new ArrayList<>();
    	    try {
    	        ObjectMapper mapper = new ObjectMapper();
    	        placeList = mapper.readValue(schedule.getPlace(), new TypeReference<List<Place>>() {});
    	    } catch (Exception e) {
    	        e.printStackTrace();
    	    }

    	
        return ScheduleDTO.builder()
                .id(schedule.getId())
                .title(schedule.getTitle())
                .description(schedule.getDescription())
                .date(schedule.getDate())
                .isPublic(schedule.isPublic())
                .places(schedule.getPlaces())
                .userId(schedule.getUser().getUserId())
                .username(schedule.getUser().getUsername()) 
                .build();
    }
}
