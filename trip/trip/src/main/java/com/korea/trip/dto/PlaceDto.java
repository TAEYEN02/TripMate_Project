package com.korea.trip.dto;

import lombok.Data;

@Data
public class PlaceDto {
    private String name;
    private String address;
    private String category;
    private String categoryCode;
    private double lat;
    private double lng;
    private String photoUrl;


}
