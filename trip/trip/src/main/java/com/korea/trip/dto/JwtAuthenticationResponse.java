package com.korea.trip.dto;

import lombok.Getter;

@Getter
public class JwtAuthenticationResponse {
	
	private String accessToken;
    private String tokenType = "Bearer";

    public JwtAuthenticationResponse(String accessToken) {
        this.accessToken = accessToken;
    }
}

