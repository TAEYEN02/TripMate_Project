package com.korea.trip.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.trip.models.Review;
import com.korea.trip.models.UserPrincipal;
import com.korea.trip.repositories.ReviewRepository;
import com.korea.trip.repositories.UserRepository;
import com.korea.trip.security.CurrentUser;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public List<Review> getReviews(@CurrentUser UserPrincipal currentUser) {
        return reviewRepository.findByUserId(currentUser.getId());
    }
    
    @PostMapping
    public Review createReview(@CurrentUser UserPrincipal currentUser, @RequestBody Review review) {
        return userRepository.findById(currentUser.getId()).map(user -> {
            review.setUser(user);
            return reviewRepository.save(review);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    // 수정 및 삭제 로직 추가 (필요시)
}
