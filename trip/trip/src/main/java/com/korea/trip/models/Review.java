package com.korea.trip.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private int rating; // e.g., 1 to 5

    @ManyToOne
    private User user;

    @Column(nullable = false)
    private String content;

    @Column
    private int likes = 0;

    @Column
    private int dislikes = 0;

//    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL)
//    private List<MyCommentEntity> comments;
}