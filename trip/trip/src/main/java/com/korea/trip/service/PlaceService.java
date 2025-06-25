package com.korea.trip.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.korea.trip.dto.PlaceDto;
import com.korea.trip.util.KakaoPlaceUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final KakaoPlaceUtil kakaoPlaceUtil;

    public List<PlaceDto> searchPlaces(String keyword, String categoryFilter) {
        return kakaoPlaceUtil.searchPlaces(keyword, categoryFilter);
    }
}