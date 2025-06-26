package com.korea.trip.dto;

import lombok.Data;

@Data
public class TransportRequest {
    private String departure;
    private String arrival;
    private String date;
    
}