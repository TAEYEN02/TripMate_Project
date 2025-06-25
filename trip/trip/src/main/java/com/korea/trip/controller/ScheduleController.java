package com.korea.trip.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.trip.dto.ScheduleCreateRequest;
import com.korea.trip.dto.ScheduleResponse;
import com.korea.trip.service.ScheduleService;

@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping("/auto-generate")
    public ResponseEntity<?> autoGenerate(@RequestBody ScheduleCreateRequest request) {
    	try {
            ScheduleResponse schedule = scheduleService.generateSchedule(request);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("서버 오류 발생: " + e.getMessage());
        }

    }
}