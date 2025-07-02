package com.korea.trip.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.korea.trip.models.Place;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long>{
	List<Place> findByNameContainingAndCategoryAndAddressContaining(String name, String category, String address);
}
