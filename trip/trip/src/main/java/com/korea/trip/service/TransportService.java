package com.korea.trip.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.korea.trip.dto.TransportResult;
import com.korea.trip.util.BusUtil;
import com.korea.trip.util.KorailUtil;
import com.korea.trip.dto.TrainInfo;
import com.korea.trip.dto.BusInfo;

/**
 * 교통수단 추천 서비스
 * 기차(KORAIL)와 버스 정보를 조회하여 사용자에게 교통 옵션을 제공합니다.
 */
@Service
public class TransportService {

    // 기차 정보 조회를 위한 유틸리티 클래스
    private final KorailUtil korailUtil;
    // 버스 정보 조회를 위한 유틸리티 클래스
    private final BusUtil busUtil;

    /**
     * 생성자 주입을 통한 의존성 주입
     * @param korailUtil 기차 정보 조회 유틸리티
     * @param busUtil 버스 정보 조회 유틸리티
     */
    public TransportService(KorailUtil korailUtil, BusUtil busUtil) {
        this.korailUtil = korailUtil;
        this.busUtil = busUtil;
    }

    /**
     * 교통수단 추천 메서드
     * 사용자가 입력한 정보를 바탕으로 기차와 버스 옵션을 모두 조회합니다.
     * 
     * @param request 사용자가 입력한 교통 정보 (출발지, 도착지, 날짜 등)
     * @return 기차와 버스 정보가 포함된 통합 결과 객체
     */
    public TransportResult recommendTransport(TrainInfo request) {
        // 1단계: 기차 정보 조회
        // KORAIL API를 통해 해당 경로의 기차 정보를 가져옵니다
        List<TrainInfo> korail = korailUtil.fetchKorail(request);
        
        // 2단계: 버스 정보 조회를 위한 데이터 변환
        // TrainInfo 객체를 BusInfo 객체로 변환합니다
        // (두 클래스의 필드명이 다르기 때문에 변환이 필요합니다)
        BusInfo busRequest = new BusInfo();
        busRequest.setDepPlaceNm(request.getDepPlaceName());    // 출발지 설정
        busRequest.setArrPlaceNm(request.getArrPlaceName());    // 도착지 설정
        busRequest.setDepPlandTime(request.getDepPlandTime());  // 출발 시간 설정
        
        // 3단계: 버스 정보 조회
        // 버스 API를 통해 해당 경로의 버스 정보를 가져옵니다
        List<BusInfo> bus = busUtil.fetchBus(busRequest);

        // 4단계: 결과 통합 및 반환
        // 기차와 버스 정보를 하나의 결과 객체에 담아서 반환합니다
        TransportResult result = new TransportResult();
        result.setKorailOptions(korail);  // 기차 옵션 설정
        result.setBusOptions(bus);        // 버스 옵션 설정
        return result;
    }
}
