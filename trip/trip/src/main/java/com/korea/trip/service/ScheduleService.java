
package com.korea.trip.service;

import org.springframework.stereotype.Service;


import com.korea.trip.dto.ScheduleResponse;
import com.korea.trip.util.GenerateItinerary;

@Service
public class ScheduleService {



    public ScheduleService(GenerateItinerary generateItinerary) {
        this.generateItinerary = generateItinerary;
    }


