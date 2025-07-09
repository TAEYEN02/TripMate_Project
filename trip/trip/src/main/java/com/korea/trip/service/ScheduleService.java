package com.korea.trip.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.korea.trip.dto.PlaceDTO;
import com.korea.trip.dto.ScheduleCreateRequest;
import com.korea.trip.dto.ScheduleDTO;
import com.korea.trip.dto.ScheduleResponse;
import com.korea.trip.models.Place;
import com.korea.trip.models.Schedule;
import com.korea.trip.models.User;
import com.korea.trip.repositories.PlaceRepository;
import com.korea.trip.repositories.ScheduleRepository;
import com.korea.trip.repositories.UserRepository;

import java.time.format.DateTimeFormatter;
import com.korea.trip.util.GenerateItinerary;
import com.korea.trip.util.KakaoPlaceUtil;

import jakarta.transaction.Transactional;

@Service
public class ScheduleService {

	private final GenerateItinerary generateItinerary;
	private final UserRepository userRepository;
	private final ScheduleRepository scheduleRepository;
	private final PlaceRepository placeRepository;
	private final KakaoPlaceUtil kakaoPlaceUtil; // KakaoPlaceUtil 주입

	@Autowired
	public ScheduleService(GenerateItinerary generateItinerary, UserRepository userRepository,
			ScheduleRepository scheduleRepository, PlaceRepository placeRepository, KakaoPlaceUtil kakaoPlaceUtil) { // 생성자에
																														// 추가
		this.generateItinerary = generateItinerary;
		this.userRepository = userRepository;
		this.scheduleRepository = scheduleRepository;
		this.placeRepository = placeRepository;
		this.kakaoPlaceUtil = kakaoPlaceUtil; // 주입된 객체 할당
	}

	// This method might need updating if GenerateItinerary produces multi-day
	// responses
	public ScheduleResponse generateSchedule(String departure, String arrival, java.time.LocalDateTime startTime,
			java.time.LocalDateTime endTime, String transportType) {
		return generateItinerary.generate(departure, arrival, startTime, endTime, transportType);
	}

	@Transactional
	public void saveScheduleToUser(ScheduleResponse response, Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Schedule entity = new Schedule();
		entity.setUser(user);
		// Assuming single date from response for now, might need endDate if response
		// changes
		entity.setStartDate(response.getDate());
		entity.setTitle(response.getTitle());
		entity.setDeparture(response.getDeparture());
		entity.setArrival(response.getArrival());
		entity.setTransportType(response.getTransportType());
		entity.setPublic(false);

		if (response.getPlaces() != null) {
			for (PlaceDTO placeDto : response.getPlaces()) {
				Place newPlace = new Place();
				newPlace.setName(placeDto.getName());
				newPlace.setAddress(placeDto.getAddress());
				newPlace.setLat(placeDto.getLat());
				newPlace.setLng(placeDto.getLng());
				newPlace.setDate(response.getDate()); // Assigning the schedule's date to the place
				newPlace.setCategory(placeDto.getCategoryCode()); // Map categoryCode from DTO to category in Entity
				newPlace.setImageUrl(placeDto.getPhotoUrl()); // Map photoUrl from DTO to imageUrl in Entity
				newPlace.setSchedule(entity);
				entity.getPlaces().add(newPlace);
			}
		}

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

	@Transactional
	public void updateSchedulePublicStatus(Long scheduleId, boolean isPublic) {
		Schedule schedule = scheduleRepository.findById(scheduleId)
				.orElseThrow(() -> new RuntimeException("Schedule not found"));
		schedule.setPublic(isPublic);
		scheduleRepository.save(schedule);
	}

	@Transactional
	public void deleteSchedule(Long id) {
		if (!scheduleRepository.existsById(id)) {
			throw new RuntimeException("id를 찾을 수 없습니다");
		}
		scheduleRepository.deleteById(id);
	}

	@Transactional
	public Schedule updateSchedule(Long scheduleId, ScheduleDTO scheduleDTO) {
		Schedule schedule = scheduleRepository.findById(scheduleId)
				.orElseThrow(() -> new RuntimeException("Schedule not found with id " + scheduleId));

		schedule.setTitle(scheduleDTO.getTitle());
		schedule.setStartDate(scheduleDTO.getStartDate());
		schedule.setEndDate(scheduleDTO.getEndDate());
		schedule.setDeparture(scheduleDTO.getDeparture());
		schedule.setArrival(scheduleDTO.getArrival());
		schedule.setTransportType(scheduleDTO.getTransportType());
		schedule.setPublic(scheduleDTO.isPublic());

		schedule.getPlaces().clear();

		if (scheduleDTO.getPlaces() != null) {
			for (PlaceDTO placeDto : scheduleDTO.getPlaces()) {
				Place newPlace = new Place();
				newPlace.setName(placeDto.getName());
				newPlace.setAddress(placeDto.getAddress());
				newPlace.setLat(placeDto.getLat());
				newPlace.setLng(placeDto.getLng());
				newPlace.setDate(placeDto.getDate()); // Set the date for each place
				newPlace.setSchedule(schedule);
				schedule.getPlaces().add(newPlace);
			}
		}

		return scheduleRepository.save(schedule);
	}

	public List<ScheduleDTO> getSharedSchedulesByUser(Long userId) {
		List<Schedule> schedules = scheduleRepository.findByUserIdAndIsPublicTrue(userId);
		return schedules.stream().map(ScheduleDTO::fromEntity).collect(Collectors.toList());
	}

	// This method might need review if places are now date-specific
	@Transactional
	public void deletePlace(Long placeId, Long userId) {
		Place place = placeRepository.findById(placeId).orElseThrow(() -> new RuntimeException("장소를 찾을 수 없습니다."));

		Schedule schedule = place.getSchedule();
		if (schedule == null) {
			throw new RuntimeException("장소에 연결된 일정이 없습니다.");
		}

		if (!schedule.getUser().getId().equals(userId)) {
			throw new RuntimeException("권한이 없습니다.");
		}

		schedule.getPlaces().remove(place);
		place.setSchedule(null);
		placeRepository.delete(place);
	}

	// 새로운 여행지 추천 서비스 메서드
	public List<PlaceDTO> getRecommendedPlaces(String keyword) {
		// KakaoPlaceUtil을 사용하여 키워드에 맞는 장소들을 검색합니다.
		// 여기서는 특정 카테고리 필터 없이 일반 검색을 수행합니다.
		return kakaoPlaceUtil.searchPlaces(keyword, null);
	}

	public ScheduleDTO createSchedule(ScheduleCreateRequest request, Long userId) {
		 System.out.println("Request received: " + request);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Schedule schedule = new Schedule();
        schedule.setUser(user);

        schedule.setDeparture(request.getDeparture());
        schedule.setArrival(request.getArrival());
        schedule.setTransportType(request.getTransportType());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());

        // 날짜 처리: 시작일(date) 기준으로 days를 더해서 종료일 계산
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(request.getDate(), formatter);
        schedule.setStartDate(request.getDate());

        if (request.getDays() != null && request.getDays() > 1) {
            LocalDate endDate = startDate.plusDays(request.getDays() - 1);
            schedule.setEndDate(endDate.format(formatter));
        } else {
            // days가 없거나 1 이하인 경우 시작일과 동일하게 세팅
            schedule.setEndDate(request.getDate());
        }

        schedule.setTitle(request.getDeparture() + " → " + request.getArrival() + " 일정");
        schedule.setDescription("");

        // places 매핑 처리
        if (request.getPlaces() != null && !request.getPlaces().isEmpty()) {
            List<Place> placeEntities = request.getPlaces().stream()
                .map(dto -> {
                    Place place = new Place();
                    place.setName(dto.getName());
                    place.setCategory(dto.getCategory());
                    place.setLat(dto.getLat());
                    place.setLng(dto.getLng());
                    place.setDate(dto.getDate());
                    place.setSchedule(schedule); // 연관관계 설정
                    return place;
                })
                .collect(Collectors.toList());

            schedule.setPlaces(placeEntities);
        }

        Schedule saved = scheduleRepository.save(schedule);
        return ScheduleDTO.fromEntity(saved);
    }
}
