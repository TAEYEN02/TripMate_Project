package com.korea.trip.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.trip.dto.MultiDayScheduleResponse;
import com.korea.trip.dto.ScheduleCreateRequest;
import com.korea.trip.dto.ScheduleDTO;
import com.korea.trip.dto.ScheduleRequest;
import com.korea.trip.dto.ScheduleResponse;
import com.korea.trip.models.Schedule;
import com.korea.trip.models.UserPrincipal;
import com.korea.trip.security.CurrentUser;
import com.korea.trip.service.ScheduleService;
import com.korea.trip.util.GenerateItinerary;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "http://localhost:3000")
public class ScheduleController {

	private final ScheduleService scheduleService;
	// 자동일정 생성 컨트롤러
	private final GenerateItinerary generateItinerary;

	public ScheduleController(ScheduleService scheduleService, GenerateItinerary generateItinerary) {
		this.scheduleService = scheduleService;
		this.generateItinerary = generateItinerary;
	}

	@PostMapping("/auto-generate")
	public ResponseEntity<?> autoGenerate(@RequestBody ScheduleCreateRequest request,
			@CurrentUser UserPrincipal currentUser) {
		try {
			ScheduleResponse schedule = scheduleService.generateSchedule(request.getDeparture(), request.getArrival(),
					request.getDate(), request.getTransportType());

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
		return generateItinerary.generateMultiDaySchedule(request.getDeparture(), request.getArrival(),
				request.getDate(), request.getDays());
	}

	@GetMapping("/shared")
	public ResponseEntity<List<ScheduleDTO>> getSharedSchedules() {
		List<Schedule> sharedSchedules = scheduleService.getSharedSchedules();
		List<ScheduleDTO> dtoList = sharedSchedules.stream().map(ScheduleDTO::fromEntity).toList();
		return ResponseEntity.ok(dtoList);
	}

	@GetMapping("/my-schedules")
	public ResponseEntity<List<ScheduleDTO>> getMySchedules(@CurrentUser UserPrincipal currentUser) {
		List<Schedule> schedules = scheduleService.getSchedulesByUserId(currentUser.getId());
		List<ScheduleDTO> dtos = schedules.stream().map(ScheduleDTO::fromEntity).collect(Collectors.toList());
		return ResponseEntity.ok(dtos);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Schedule> getScheduleById(@PathVariable("id") Long id) {
		Schedule schedule = scheduleService.getScheduleById(id);
		return ResponseEntity.ok(schedule);
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Schedule>> getSchedulesByUserId(@PathVariable("userId") Long userId) {
		List<Schedule> schedules = scheduleService.getSchedulesByUserId(userId);
		return ResponseEntity.ok(schedules);
	}

	@PutMapping("/{scheduleId}/share")
	public ResponseEntity<?> updateSchedulePublicStatus(@PathVariable("scheduleId") Long scheduleId,
			@RequestBody Map<String, Boolean> payload) {
		try {
			scheduleService.updateSchedulePublicStatus(scheduleId, payload.get("isPublic"));
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteSchedule(@PathVariable("id") Long id) {
		try {
			scheduleService.deleteSchedule(id);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/shared/my")
	public ResponseEntity<List<ScheduleDTO>> getMySharedSchedules(@AuthenticationPrincipal UserPrincipal user) {
		Long userId = user.getId(); // 로그인된 사용자의 DB PK
		List<ScheduleDTO> sharedSchedules = scheduleService.getSharedSchedulesByUser(userId);
		return ResponseEntity.ok(sharedSchedules);
	}

	@DeleteMapping("/schedule/place/{placeId}")
	public ResponseEntity<?> deletePlaceFromSchedule(@PathVariable Long placeId,
			@AuthenticationPrincipal UserPrincipal user) {
		try {
			scheduleService.deletePlace(placeId, user.getId());
			return ResponseEntity.ok("삭제 성공");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("삭제 실패: " + e.getMessage());
		}
	}

}
