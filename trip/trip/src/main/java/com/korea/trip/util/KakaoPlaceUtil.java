package com.korea.trip.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.trip.dto.PlaceDto;


@Component
public class KakaoPlaceUtil {

    @Value("${kakao.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<PlaceDto> searchRecommendedPlaces(String keyword) {
        return searchPlaces(keyword, null);
    }

    public List<PlaceDto> searchPlaces(String keyword, String categoryFilter) {
        String url = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + keyword + "&size=10";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        List<PlaceDto> result = new ArrayList<>();
        try {
            JsonNode docs = new ObjectMapper().readTree(response.getBody()).get("documents");

            for (JsonNode doc : docs) {
                String category = doc.get("category_group_code").asText(); // 예: FD6, AT4

                // 필터가 설정되어 있을 경우, 해당 카테고리에만 포함
                if (categoryFilter != null && !category.equals(categoryFilter)) continue;

                PlaceDto place = new PlaceDto();
                place.setName(doc.get("place_name").asText());
                place.setAddress(doc.get("address_name").asText());
                place.setCategory(doc.get("category_name").asText());
                place.setLat(Double.parseDouble(doc.get("y").asText()));
                place.setLng(Double.parseDouble(doc.get("x").asText()));
                
                place.setCategoryCode(category);
                
                result.add(place);
            }
        } catch (Exception e) {
            throw new RuntimeException("장소 파싱 실패", e);
        }

        return result;
    }
}
