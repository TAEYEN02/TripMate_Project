package com.korea.trip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.korea.trip.models.Schedule;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByUserId(Long userId);
    List<Schedule> findAllByIsPublicTrue();
	List<Schedule> findByUserIdAndIsPublicTrue(Long userId);
	List<Schedule> findByUserIdAndTitleContaining(Long userId, String title);
    List<Schedule> findByUserIdAndIsCopiedTrue(Long userId); // 찜한 일정만 조회
    List<Schedule> findByUserIdAndIsCopiedFalse(Long userId); // 직접 작성한 일정만 조회
}