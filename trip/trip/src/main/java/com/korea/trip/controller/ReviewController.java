package com.korea.trip.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.trip.models.Review;
import com.korea.trip.models.Schedule;
import com.korea.trip.models.User;
import com.korea.trip.models.UserPrincipal;
import com.korea.trip.repositories.ReviewRepository;
import com.korea.trip.repositories.ScheduleRepository;
import com.korea.trip.repositories.UserRepository;
import com.korea.trip.security.CurrentUser;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ScheduleRepository scheduleRepository; // ScheduleRepository 추가
    
    @GetMapping
    public List<Review> getReviews(@CurrentUser UserPrincipal currentUser) {
        return reviewRepository.findByUserId(currentUser.getId());
    }
    
    @GetMapping("/schedule/{scheduleId}") // 특정 스케줄의 리뷰 가져오��
    public List<Review> getReviewsBySchedule(@PathVariable("scheduleId") Long scheduleId) {
        return reviewRepository.findByScheduleId(scheduleId);
    }
    
    @PostMapping("/{scheduleId}") // 스케줄에 리뷰 생성
    public Review createReview(@CurrentUser UserPrincipal currentUser, 
                               @PathVariable("scheduleId") Long scheduleId, 
                               @RequestBody Review review) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        
        review.setUser(user);
        review.setSchedule(schedule); // 리뷰에 스케줄 설정
        return reviewRepository.save(review);
    }
    
    // 수정 및 삭제 로직 추가 (필요시)
}
