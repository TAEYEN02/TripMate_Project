package com.korea.trip.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class DefaultController {

    @GetMapping("/")
    public ResponseEntity<?> handleRoot() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body("This is a backend API server. Use /api/auth/... endpoints.");
    }
}
