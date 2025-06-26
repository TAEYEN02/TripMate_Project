package com.korea.trip.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.korea.trip.dto.TransportResult;
import com.korea.trip.util.BusUtil;
import com.korea.trip.util.KorailUtil;
import com.korea.trip.dto.TrainInfo;

@Service
public class TransportService {

    private final KorailUtil korailUtil;
    private final BusUtil busUtil;

    public TransportService(KorailUtil korailUtil, BusUtil busUtil) {
        this.korailUtil = korailUtil;
        this.busUtil = busUtil;
    }

    public TransportResult recommendTransport(TrainInfo request) {
        List<TrainInfo> korail = korailUtil.fetchKorail(request);
        List<String> bus = busUtil.fetchBus(request.getDepPlaceName(), request.getArrPlaceName(), request.getDepPlandTime());

        TransportResult result = new TransportResult();
        result.setKorailOptions(korail);
        result.setBusOptions(bus);
        return result;
    }
}
