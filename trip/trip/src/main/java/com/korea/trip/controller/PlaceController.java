package com.korea.trip.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.korea.trip.dto.PlaceDto;
import com.korea.trip.service.PlaceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/place")
@RequiredArgsConstructor
public class PlaceController {

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