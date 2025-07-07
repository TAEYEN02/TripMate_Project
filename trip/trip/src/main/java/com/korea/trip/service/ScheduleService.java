package com.korea.trip.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.trip.dto.ScheduleResponse;
import com.korea.trip.models.Schedule;
import com.korea.trip.models.User;
import com.korea.trip.repositories.ScheduleRepository;
import com.korea.trip.repositories.UserRepository;
import com.korea.trip.util.GenerateItinerary;

@Service
public class ScheduleService {

    private final GenerateItinerary generateItinerary;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    @Autowired
    public ScheduleService(
        GenerateItinerary generateItinerary,
        UserRepository userRepository,
        ScheduleRepository scheduleRepository
    ) {
        this.generateItinerary = generateItinerary;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public ScheduleResponse generateSchedule(String departure, String arrival, String date, String transportType) {
        return generateItinerary.generate(departure, arrival, date, transportType);
    }

    public void saveScheduleToUser(ScheduleResponse response, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Schedule entity = new Schedule();
        entity.setUser(user);
        entity.setDate(response.getDate());

        try {
            ObjectMapper mapper = new ObjectMapper();
            String placesJson = mapper.writeValueAsString(response.getPlaces());
            entity.setPlaces(placesJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing places to JSON", e);
        }

        entity.setPublic(false); // ✅ boolean 필드 setter는 setPublic

        scheduleRepository.save(entity);
    }

    public List<Schedule> getSharedSchedules() {
        return scheduleRepository.findAllByIsPublicTrue();
    }

    public void updateSchedulePublicStatus(Long scheduleId, boolean isPublic) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new RuntimeException("Schedule not found"));
        schedule.setPublic(isPublic);
        scheduleRepository.save(schedule);
    }
}
