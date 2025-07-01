package com.korea.trip.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.trip.dto.place.place.PlaceResponse;
import com.korea.trip.dto.place.place.PlaceSearchRequest;
=======
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.korea.trip.dto.PlaceDto;
>>>>>>> 8d1750e2444098264ee6d204cd7b7aa2785a441a
import com.korea.trip.service.PlaceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/place")
@RequiredArgsConstructor
public class PlaceController {
<<<<<<< HEAD
	private final PlaceService placeService;
	
	// 키워드 + 필터 검색
	@PostMapping("/search")
    public ResponseEntity<List<PlaceResponse>> searchPlaces(@RequestBody PlaceSearchRequest request) {
        List<PlaceResponse> results = placeService.searchPlaces(request);
        return ResponseEntity.ok(results);
    }
	
	// 정보 상세 정보 조회
	@GetMapping("{placeId}")
	public ResponseEntity<PlaceResponse> getPlaceDatel(@PathVariable Long placeId) {
		PlaceResponse place = placeService.getPlaceById(placeId);
		
		return ResponseEntity.ok(place);
	}
} 
=======

    private final PlaceService placeService;

    @GetMapping("/search")
    public ResponseEntity<List<PlaceDto>> searchPlaces(
            @RequestParam(name = "keyword") String keyword,
            @RequestParam(name = "category", required = false) String category
    ) {
        List<PlaceDto> results = placeService.searchPlaces(keyword, category);
        return ResponseEntity.ok(results);
    }

}
>>>>>>> 8d1750e2444098264ee6d204cd7b7aa2785a441a
