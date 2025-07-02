package com.korea.trip.controller;

import com.korea.trip.dto.StationInfo;
import com.korea.trip.dto.TerminalInfo;
import com.korea.trip.util.BusUtil;
import com.korea.trip.util.KorailUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StationController {

    private final KorailUtil korailUtil;
    private final BusUtil busUtil;

    public StationController(KorailUtil korailUtil, BusUtil busUtil) {
        this.korailUtil = korailUtil;
        this.busUtil = busUtil;
    }

    // 🚄 기차 역 전체 맵
    @GetMapping("/stations")
    public ResponseEntity<Map<String, List<StationInfo>>> getAllTrainStations() {
        return ResponseEntity.ok(korailUtil.getCityStationMap());
    }

    // 🚄 기차 역 도시별
    @GetMapping("/station/city")

}