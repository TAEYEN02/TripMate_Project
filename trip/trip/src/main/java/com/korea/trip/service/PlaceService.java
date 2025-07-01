package com.korea.trip.service;

import java.util.List;
<<<<<<< HEAD
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.korea.trip.dto.place.place.PlaceResponse;
import com.korea.trip.dto.place.place.PlaceSearchRequest;
import com.korea.trip.models.Place;
import com.korea.trip.repositories.PlaceRepository;
=======

import org.springframework.stereotype.Service;

import com.korea.trip.dto.PlaceDto;
import com.korea.trip.util.KakaoPlaceUtil;
>>>>>>> 8d1750e2444098264ee6d204cd7b7aa2785a441a

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlaceService {
<<<<<<< HEAD
	
    private final PlaceRepository placeRepository;
    
    // 장소 검색
    public List<PlaceResponse> searchPlaces(PlaceSearchRequest request) {
        List<Place> filteredPlaces = placeRepository.findAll().stream()
                .filter(place ->
                        (request.getKeyword() == null || place.getName().contains(request.getKeyword())) &&
                        (request.getCategory() == null || place.getCategory().equalsIgnoreCase(request.getCategory())) &&
                        (request.getRegion() == null || place.getAddress().contains(request.getRegion()))
                )
                .collect(Collectors.toList());

        return filteredPlaces.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // 장소 상세 조회
    public PlaceResponse getPlaceById(Long placeId) {
        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 장소가 존재하지 않습니다."));

        return convertToResponse(place);
    }
    
    // Entity -> DTO 변환
	private PlaceResponse convertToResponse(Place place) {
        return PlaceResponse.builder()
                .id(place.getId())
                .name(place.getName())
                .lat(place.getLat())
                .lng(place.getLng())
                .category(place.getCategory())
                .address(place.getAddress())
                .phone(place.getPhone())
                .imageUrl(place.getImageUrl())
                .build();
    }
}
=======

    private final KakaoPlaceUtil kakaoPlaceUtil;

    public List<PlaceDto> searchPlaces(String keyword, String categoryFilter) {
        return kakaoPlaceUtil.searchPlaces(keyword, categoryFilter);
    }
}
>>>>>>> 8d1750e2444098264ee6d204cd7b7aa2785a441a
