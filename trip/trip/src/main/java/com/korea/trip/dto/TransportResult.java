package com.korea.trip.dto;

import java.util.List;

import lombok.Data;
import com.korea.trip.dto.TrainInfo;

@Data
public class TransportResult {
    private List<TrainInfo> korailOptions;
    private List<String> busOptions;
}
