// ScheduleController.java
package com.korea.trip.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.trip.dto.MultiDayScheduleResponse;
import com.korea.trip.dto.ScheduleCreateRequest;
import com.korea.trip.dto.ScheduleRequest;
import com.korea.trip.dto.ScheduleResponse;
import com.korea.trip.models.UserPrincipal;
import com.korea.trip.security.CurrentUser;
import com.korea.trip.service.ScheduleService;
import com.korea.trip.util.GenerateItinerary;

@RestController
@RequestMapping("/schedule")
@CrossOrigin(origins = "http://localhost:3000") 
public class ScheduleController {

    private final ScheduleService scheduleService;
    //자동일정 생성 컨트롤러
    private final GenerateItinerary generateItinerary;
    

    public ScheduleController(ScheduleService scheduleService, GenerateItinerary generateItinerary) {
        this.scheduleService = scheduleService;
        this.generateItinerary = generateItinerary;
    }

    @PostMapping("/auto-generate")
    public ResponseEntity<?> autoGenerate(@RequestBody ScheduleCreateRequest request, 
                                          @CurrentUser UserPrincipal currentUser) {
        try {
            ScheduleResponse schedule = scheduleService.generateSchedule(
                request.getDeparture(),
                request.getArrival(),
                request.getDate(),
                request.getTransportType()
            );

            scheduleService.saveScheduleToUser(schedule, currentUser.getId());

            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("서버 오류 발생: " + e.getMessage());
        }
    }
    
    // 다일정 생성 엔드포인트
    @PostMapping("/generate-multi")
    public MultiDayScheduleResponse generateMultiDay(@RequestBody ScheduleRequest request) {
        // ScheduleRequest는 departure, arrival, date, days 필드가 있는 DTO
        return generateItinerary.generateMultiDaySchedule(
                request.getDeparture(),
                request.getArrival(),
                request.getDate(),
                request.getDays()
        );
    }
    
    
}
