package com.korea.trip.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.trip.models.Schedule;
import com.korea.trip.models.UserPrincipal;
import com.korea.trip.repositories.ScheduleRepository;
import com.korea.trip.repositories.UserRepository;
import com.korea.trip.security.CurrentUser;

@RestController
@RequestMapping("/api/schedulesList")
public class ScheduleListController {
	 @Autowired
	    private ScheduleRepository scheduleRepository;
	    @Autowired
	    private UserRepository userRepository;

	    @GetMapping
	    public List<Schedule> getSchedules(@CurrentUser UserPrincipal currentUser) {
	        return scheduleRepository.findByUserId(currentUser.getId());
	    }

	    @PostMapping
	    public Schedule createSchedule(@CurrentUser UserPrincipal currentUser, @RequestBody Schedule schedule) {
	        return userRepository.findById(currentUser.getId()).map(user -> {
	            schedule.setUser(user);
	            return scheduleRepository.save(schedule);
	        }).orElseThrow(() -> new RuntimeException("User not found"));
	    }
	    
	    // 수정 및 삭제 로직 추가 (필요시)
	}
