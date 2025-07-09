package com.korea.trip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.korea.trip.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(String userId);
    boolean existsByUserId(String userId);
    boolean existsByEmail(String email);
	boolean existsByUsername(String username);
}