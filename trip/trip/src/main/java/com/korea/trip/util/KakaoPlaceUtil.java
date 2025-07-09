package com.korea.trip.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.trip.dto.PlaceDTO;

@Component
public class KakaoPlaceUtil {

    @Value("${kakao.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<PlaceDTO> searchRecommendedPlaces(String keyword) {
        String url = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + keyword + "&size=15";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        List<PlaceDTO> result = new ArrayList<>();
        try {
            JsonNode docs = new ObjectMapper().readTree(response.getBody()).get("documents");

            for (JsonNode doc : docs) {
            	PlaceDTO place = new PlaceDTO();
                place.setName(doc.get("place_name").asText());
                place.setAddress(doc.get("address_name").asText());
                place.setCategory(doc.get("category_name").asText());
                place.setCategoryCode(doc.get("category_group_code").asText());
                place.setLat(Double.parseDouble(doc.get("y").asText()));
                place.setLng(Double.parseDouble(doc.get("x").asText()));
                place.setPhotoUrl(searchPlaceImage(place.getName()));
                result.add(place);
            }
        } catch (Exception e) {
            throw new RuntimeException("장소 파싱 실패", e);
        }

        return result;
    }

    public List<PlaceDTO> searchPlaces(String keyword, String categoryFilter) {
        String query = keyword;
        if (categoryFilter != null && !categoryFilter.isEmpty()) {
            switch (categoryFilter) {
                case "FD6": // 음식점
                    query += " 음식점";
                    break;
                case "CE7": // 카페
                    query += " 카페";
                    break;
            }
        }

        String url = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + query + "&size=15";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        List<PlaceDTO> result = new ArrayList<>();
        try {
            JsonNode docs = new ObjectMapper().readTree(response.getBody()).get("documents");

            for (JsonNode doc : docs) {
                String category = doc.get("category_group_code").asText();

                if (categoryFilter != null && !category.equals(categoryFilter)) continue;

                PlaceDTO place = new PlaceDTO();
                place.setName(doc.get("place_name").asText());
                place.setAddress(doc.get("address_name").asText());
                place.setCategory(doc.get("category_name").asText());
                place.setLat(Double.parseDouble(doc.get("y").asText()));
                place.setLng(Double.parseDouble(doc.get("x").asText()));
                place.setCategoryCode(category);
                place.setPhotoUrl(searchPlaceImage(place.getName()));

                result.add(place);
            }
        } catch (Exception e) {
            throw new RuntimeException("카카오 장소 검색 실패", e);
        }

        return result;
    }

    public String searchPlaceImage(String keyword) {
        String url = "https://dapi.kakao.com/v2/search/image?query=" + keyword + "&sort=accuracy";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + apiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            JsonNode docs = new ObjectMapper().readTree(response.getBody()).get("documents");
            if (docs.isArray() && docs.size() > 0) {
            	return docs.get(0).get("image_url").asText();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null; // 이미지가 없으면 null
    }
}
