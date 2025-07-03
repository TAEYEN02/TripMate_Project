package com.korea.trip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.korea.trip.models.Schedule;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByUserId(Long userId);
}