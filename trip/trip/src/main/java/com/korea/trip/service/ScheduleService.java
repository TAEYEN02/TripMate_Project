package com.korea.trip.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.trip.dto.ScheduleDTO;
import com.korea.trip.dto.ScheduleResponse;
import com.korea.trip.models.Place;
import com.korea.trip.models.Schedule;
import com.korea.trip.models.User;
import com.korea.trip.repositories.PlaceRepository;
import com.korea.trip.repositories.ScheduleRepository;
import com.korea.trip.repositories.UserRepository;
import com.korea.trip.util.GenerateItinerary;

import jakarta.transaction.Transactional;

@Service
public class ScheduleService {

	private final GenerateItinerary generateItinerary;
	private final UserRepository userRepository;
	private final ScheduleRepository scheduleRepository;
	private final PlaceRepository placeRepository;

	@Autowired
	public ScheduleService(GenerateItinerary generateItinerary, UserRepository userRepository,
			ScheduleRepository scheduleRepository,PlaceRepository placeRepository) {
		this.generateItinerary = generateItinerary;
		this.userRepository = userRepository;
		this.scheduleRepository = scheduleRepository;
		this.placeRepository = placeRepository;
	}

	public ScheduleResponse generateSchedule(String departure, String arrival, String date, String transportType) {
		return generateItinerary.generate(departure, arrival, date, transportType);
	}

	public void saveScheduleToUser(ScheduleResponse response, Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Schedule entity = new Schedule();
		entity.setUser(user);
		entity.setDate(response.getDate());

		try {
			ObjectMapper mapper = new ObjectMapper();
			String placesJson = mapper.writeValueAsString(response.getPlaces());
			entity.setPlace(placesJson);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Error serializing places to JSON", e);
		}

		entity.setPublic(false); // ✅ boolean 필드 setter는 setPublic

		scheduleRepository.save(entity);
	}

	public List<Schedule> getSharedSchedules() {
		return scheduleRepository.findAllByIsPublicTrue();
	}

	public List<Schedule> getSchedulesByUserId(Long userId) {
		return scheduleRepository.findByUserId(userId);
	}

	public Schedule getScheduleById(Long id) {
		return scheduleRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Schedule not found with id " + id));
	}

	public void updateSchedulePublicStatus(Long scheduleId, boolean isPublic) {
		Schedule schedule = scheduleRepository.findById(scheduleId)
				.orElseThrow(() -> new RuntimeException("Schedule not found"));
		schedule.setPublic(isPublic);
		scheduleRepository.save(schedule);
	}

	public void deleteSchedule(Long id) {
		Schedule schedule = scheduleRepository.findById(id).orElseThrow(() -> new RuntimeException("id를 찾을 수 없습니다"));
		scheduleRepository.delete(schedule);

	}

	public List<ScheduleDTO> getSharedSchedulesByUser(Long userId) {
	    List<Schedule> schedules = scheduleRepository.findByUserIdAndIsPublicTrue(userId);
	    return schedules.stream().map(ScheduleDTO::fromEntity).toList();
	}
	
	@Transactional
	public void deletePlace(Long placeId, Long userId) {
		Place place = placeRepository.findById(placeId)
		        .orElseThrow(() -> new RuntimeException("장소를 찾을 수 없습니다."));

		    Schedule schedule = place.getSchedule();
		    if (schedule == null) {
		        throw new RuntimeException("장소에 연결된 일정이 없습니다.");
		    }

		    if (!schedule.getUser().getUserId().equals(userId)) {
		        throw new RuntimeException("권한이 없습니다.");
		    }

		    schedule.getPlaces().remove(place);
		    place.setSchedule(null);
		    placeRepository.delete(place);
//	    scheduleRepository.save(schedule);
	}

}
