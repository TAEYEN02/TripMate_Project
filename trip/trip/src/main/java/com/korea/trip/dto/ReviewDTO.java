package com.korea.trip.dto;

import com.korea.trip.models.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private String title;
    private String content;
    private int rating;
    private String username;

    public static ReviewDTO fromEntity(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .title(review.getTitle())
                .content(review.getContent())
                .rating(review.getRating())
                .username(review.getUser() != null ? review.getUser().getUsername() : "알 수 없음")
                .build();
    }
}
