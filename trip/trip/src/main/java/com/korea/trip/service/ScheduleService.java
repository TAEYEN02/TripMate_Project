package com.korea.trip.service;

import org.springframework.stereotype.Service;

import com.korea.trip.dto.ScheduleCreateRequest;
import com.korea.trip.dto.ScheduleResponse;
import com.korea.trip.util.GenerateItinerary;

@Service
public class ScheduleService {

	private final GenerateItinerary generateItinerary;

    public ScheduleService(GenerateItinerary generateItinerary) {
        this.generateItinerary = generateItinerary;
    }

    public ScheduleResponse generateSchedule(ScheduleCreateRequest request) {
        return generateItinerary.generate(
            request.getDeparture(),
            request.getArrival(),
            request.getDate(),
            request.getTransportType()
        );
    }
}

