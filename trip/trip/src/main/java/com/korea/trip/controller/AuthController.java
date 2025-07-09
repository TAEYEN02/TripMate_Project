package com.korea.trip.controller;

import com.korea.trip.config.JwtTokenProvider;
import com.korea.trip.dto.JwtAuthenticationResponse;
import com.korea.trip.dto.LoginRequest;
import com.korea.trip.dto.SignUpRequest;
import com.korea.trip.dto.api.ApiResponse;
import com.korea.trip.models.User;
import com.korea.trip.models.UserPrincipal;
import com.korea.trip.repositories.UserRepository;
import com.korea.trip.security.CurrentUser;

import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUserId(),
                        loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByUserId(signUpRequest.getUserId())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "User ID is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email is already in use!"));
        }
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Username is already taken!"));
        }

        User user = new User(
                signUpRequest.getUserId(),
                signUpRequest.getUsername(),
                passwordEncoder.encode(signUpRequest.getPassword()),
                signUpRequest.getEmail()
        );

        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(true, "User registered successfully"));
    }

    @DeleteMapping("/withdraw")
    public ResponseEntity<?> withdrawUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        User user = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);

        return ResponseEntity.ok(new ApiResponse(true, "User withdrawn successfully"));
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
        }

        String userId = authentication.getName();
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@CurrentUser UserPrincipal currentUser,
                                           @RequestBody Map<String, String> updateData) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newUsername = updateData.get("username");
        String newEmail = updateData.get("email");
        String newPassword = updateData.get("password");

        // 중복체크 (username)
        if (newUsername != null && !newUsername.equals(user.getUsername())
            && userRepository.existsByUsername(newUsername)) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Username is already taken!"));
        }

        // 중복체크 (email)
        if (newEmail != null && !newEmail.equals(user.getEmail())
            && userRepository.existsByEmail(newEmail)) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email is already in use!"));
        }

        if (newUsername != null) user.setUsername(newUsername);
        if (newEmail != null) user.setEmail(newEmail);
        if (newPassword != null && !newPassword.isEmpty()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "Profile updated successfully"));
    }
}
