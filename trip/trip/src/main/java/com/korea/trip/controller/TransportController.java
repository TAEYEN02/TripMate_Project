package com.korea.trip.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.trip.dto.TrainInfo;
import com.korea.trip.dto.TransportResult;
import com.korea.trip.service.TransportService;

@RestController
@RequestMapping("/api/transport")
public class TransportController {
    private final TransportService transportService;

    public TransportController(TransportService transportService) {
        this.transportService = transportService;
    }

    @PostMapping("/search")
    public ResponseEntity<TransportResult> search(@RequestBody TrainInfo request) {
        return ResponseEntity.ok(transportService.recommendTransport(request));
    }
}

