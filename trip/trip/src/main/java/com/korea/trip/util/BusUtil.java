package com.korea.trip.util;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.trip.dto.BusInfo;
import com.korea.trip.dto.TerminalInfo;

import jakarta.annotation.PostConstruct;

@Component
public class BusUtil {

    @Value("${bus.service-key}")
    private String serviceKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // 16개 대단위 행정구역명
    private static final List<String> REGION_LIST = List.of(
        "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
        "경기", "강원", "충청북", "충청남", "전라북", "전라남", "경상북", "경상남"
    );

    // 터미널ID 2자리 → 지역명 매핑 (누락된 지역 추가)
    private static final Map<String, String> TERMINAL_ID_REGION_MAP = Map.ofEntries(
        Map.entry("01", "서울"), Map.entry("02", "서울"), Map.entry("03", "서울"), Map.entry("04", "서울"),
        Map.entry("10", "인천"),
        Map.entry("11", "경기"), Map.entry("12", "경기"), Map.entry("13", "경기"), Map.entry("14", "경기"),
        Map.entry("15", "경기"), Map.entry("16", "경기"), Map.entry("17", "경기"), Map.entry("18", "경기"),
        Map.entry("19", "경기"),
        Map.entry("20", "강원"), Map.entry("21", "강원"), Map.entry("22", "강원"), Map.entry("23", "강원"),
        Map.entry("24", "강원"), Map.entry("25", "강원"),
        Map.entry("30", "대전"),
        Map.entry("40", "충청북"), Map.entry("41", "충청북"), Map.entry("42", "충청북"), Map.entry("43", "충청북"),
        Map.entry("44", "충청북"), Map.entry("45", "충청북"), Map.entry("46", "충청북"), Map.entry("47", "충청북"),
        Map.entry("50", "광주"),
        Map.entry("60", "전라북"), Map.entry("61", "전라북"), Map.entry("62", "전라북"), Map.entry("63", "전라북"),
        Map.entry("64", "전라북"), Map.entry("65", "전라북"), Map.entry("66", "전라북"), Map.entry("67", "전라북"),
        Map.entry("68", "전라북"), Map.entry("69", "전라북"),
        Map.entry("70", "부산"),
        Map.entry("80", "대구"), Map.entry("81", "경상북"), Map.entry("82", "경상북"), Map.entry("83", "경상북"),
        Map.entry("84", "경상북"), Map.entry("85", "경상북"), Map.entry("86", "경상북"), Map.entry("87", "경상북"),
        Map.entry("88", "경상북"), Map.entry("89", "경상북"),
        // 누락된 지역 추가
//        Map.entry("71", "울산"),
        Map.entry("35", "세종"),
        Map.entry("31", "충청남"),
        Map.entry("51", "전라남"),
        Map.entry("71", "경상남")
    );

    private Map<String, List<TerminalInfo>> regionTerminalMap = new LinkedHashMap<>();

    @PostConstruct
    public void init() {
        regionTerminalMap = fetchRegionTerminalMap();
        System.out.println("✅ 행정구역별 버스 터미널 목록 로딩 완료: " + regionTerminalMap.size() + "개 지역");
        regionTerminalMap.forEach((region, terminals) -> {
            String names = terminals.stream()
                .map(TerminalInfo::getTerminalName)
                .collect(Collectors.joining(", ", "[", "]"));
            System.out.printf("[%s] 터미널 수: %d, 터미널명들: %s%n", region, terminals.size(), names);
        });
    }

    public Map<String, List<TerminalInfo>> getCityTerminalMap() {
        return regionTerminalMap;
    }

    // 터미널ID 기반 지역 분류 (중복 제거 추가)
    private Map<String, List<TerminalInfo>> fetchRegionTerminalMap() {
        Map<String, List<TerminalInfo>> map = new LinkedHashMap<>();
        Map<String, Set<String>> regionTerminalNames = new HashMap<>(); // 중복 제거용

        REGION_LIST.forEach(region -> {
            map.put(region, new ArrayList<>());
            regionTerminalNames.put(region, new HashSet<>());
        });

        String terminalUrl = "https://apis.data.go.kr/1613000/ExpBusInfoService/getExpBusTrminlList"
                           + "?serviceKey=" + serviceKey
                           + "&_type=json"
                           + "&numOfRows=1000";

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(terminalUrl, String.class);
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode items = root.path("response").path("body").path("items").path("item");

            List<TerminalInfo> allTerminals = new ArrayList<>();
            if (items.isArray()) {
                for (JsonNode item : items) {
                    allTerminals.add(new TerminalInfo(
                        item.path("terminalId").asText(),
                        item.path("terminalNm").asText(),
                        null
                    ));
                }
            } else if (items.isObject()) {
                allTerminals.add(new TerminalInfo(
                    items.path("terminalId").asText(),
                    items.path("terminalNm").asText(),
                    null
                ));
            }

            // 터미널ID 기반 분류 + 이름 중복 제거
            for (TerminalInfo terminal : allTerminals) {
                String terminalId = terminal.getTerminalId();
                if (terminalId == null || terminalId.length() < 6) continue;
                
                String code = terminalId.substring(4, 6);
                String region = TERMINAL_ID_REGION_MAP.get(code);
                
                if (region != null) {
                    String terminalName = terminal.getTerminalName();
                    Set<String> nameSet = regionTerminalNames.get(region);
                    
                    // 이름 중복 체크
                    if (!nameSet.contains(terminalName)) {
                        map.get(region).add(terminal);
                        nameSet.add(terminalName);
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("🛑 터미널 전체 조회 실패: " + e.getMessage());
        }
        return map;
    }

    // 도시명(도/광역시)으로 터미널 목록 조회
    public List<TerminalInfo> getTerminalsByCityKeyword(String keyword) {
        String simplifiedKeyword = simplifyCityName(keyword);
        return regionTerminalMap.getOrDefault(simplifiedKeyword, Collections.emptyList());
    }

    // 버스 일정 조회
    public List<BusInfo> fetchBus(String depTerminalId, String arrTerminalId, String date) {
        List<BusInfo> buses = new ArrayList<>();
        String url = "https://apis.data.go.kr/1613000/ExpBusInfoService/getStrtpntAlocFndExpbusInfo"
                   + "?serviceKey=" + serviceKey
                   + "&_type=json"
                   + "&depPlaceId=" + depTerminalId
                   + "&arrPlaceId=" + arrTerminalId
                   + "&depPlandTime=" + date;

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode items = root.path("response").path("body").path("items").path("item");
            
            if (items.isArray()) {
                for (JsonNode item : items) {
                    buses.add(parseBusItem(item));
                }
            } else if (items.isObject()) {
                buses.add(parseBusItem(items));
            }
            return buses;
        } catch (Exception e) {
            System.err.println("🛑 버스 조회 실패: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    // JSON → BusInfo DTO 변환
    private BusInfo parseBusItem(JsonNode item) {
        return new BusInfo(
            item.path("gradeNm").asText(),
            item.path("routeId").asText(),
            item.path("depPlandTime").asText(),
            item.path("arrPlandTime").asText(),
            item.path("depPlaceNm").asText(),
            item.path("arrPlaceNm").asText(),
            item.path("charge").asInt()
        );
    }

    // 도시명 정규화
    private String simplifyCityName(String fullName) {
        return fullName.replace("특별시", "")
                       .replace("광역시", "")
                       .replace("도", "")
                       .trim();
    }
}