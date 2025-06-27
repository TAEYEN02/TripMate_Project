package com.korea.trip.dto;

import java.util.List;

import lombok.Data;
import com.korea.trip.dto.TrainInfo;
import com.korea.trip.dto.BusInfo;

@Data
public class TransportResult {
    private List<TrainInfo> korailOptions;
    private List<BusInfo> busOptions;
}
