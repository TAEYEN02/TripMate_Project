package com.korea.trip.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.korea.trip.dto.TransportRequest;
import com.korea.trip.dto.TransportResult;
import com.korea.trip.util.BusUtil;
import com.korea.trip.util.KorailUtil;

@Service
public class TransportService {

    private final KorailUtil korailUtil;
    private final BusUtil busUtil;

    public TransportService(KorailUtil korailUtil, BusUtil busUtil) {
        this.korailUtil = korailUtil;
        this.busUtil = busUtil;
    }

    public TransportResult recommendTransport(TransportRequest request) {
        List<String> korail = korailUtil.fetchKorail(request.getDeparture(), request.getArrival(), request.getDate());
        List<String> bus = busUtil.fetchBus(request.getDeparture(), request.getArrival(), request.getDate());

        TransportResult result = new TransportResult();
        result.setKorailOptions(korail);
        result.setBusOptions(bus);
        return result;
    }
}
