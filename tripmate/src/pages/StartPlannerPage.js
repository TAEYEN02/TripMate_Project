import React, { useState } from "react";
import DateRangeModal from "../components/common/Modal/DateRangeModal";
import TimeSelectModal from "../components/common/Modal/TimeSelectModal";
import TransportSelectModal from "../components/common/Modal/TransportSelectModal";

// 날짜 포맷 함수 추가
const formatDate = (date) => {
    return date.toLocaleDateString("ko-KR", { 
        year: "numeric", 
        month: "long", 
        day: "numeric", 
        weekday: "long" 
    });
};

// 플래너 시작 페이지 컴포넌트
const StartPlannerPage = () => {
    // 단계별 상태 관리 (1: 날짜, 2: 시간, 3: 가는날 교통, 4: 오는날 교통, 5: 완료)
    const [step, setStep] = useState(1);
    // 선택한 날짜 범위
    const [dateRange, setDateRange] = useState(null);
    // 선택한 출발시간 정보
    const [times, setTimes] = useState(null); // { startDepart, endDepart }
    // 가는날 선택한 교통편
    const [goTransport, setGoTransport] = useState(null);
    // 오는날 선택한 교통편
    const [returnTransport, setReturnTransport] = useState(null);

    // 1단계: 날짜 선택 완료 핸들러
    const handleDateSelect = (range) => {
        setDateRange(range);
        setStep(2); // 시간 선택 단계로 이동
    };

    // 2단계: 시간 선택 완료 핸들러
    const handleTimeSelect = (selectedTimes) => {
        setTimes(selectedTimes);
        setStep(3); // 가는날 교통편 선택 단계로 이동
    };

    // 3단계: 가는날 교통편 선택 완료 핸들러
    const handleGoTransportSelect = (item) => {
        setGoTransport(item);
        setStep(4); // 오는날 교통편 선택 단계로 이동
    };

    // 4단계: 오는날 교통편 선택 완료 핸들러
    const handleReturnTransportSelect = (item) => {
        setReturnTransport(item);
        setStep(5); // 완료 화면으로 이동
    };

    // 4단계: 오는날에서 '이전' 버튼 클릭 시 가는날로 돌아가기
    const handleBackToGo = () => {
        setStep(3);
    };

    return (
        <div>
            {/* 1단계: 날짜 선택 모달 */}
            {step === 1 && (
                <DateRangeModal
                    onClose={() => { }}
                    onSelect={handleDateSelect}
                />
            )}
            {/* 2단계: 시간 선택 모달 */}
            {step === 2 && (
                <TimeSelectModal
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    onClose={() => setStep(1)}
                    onSelect={handleTimeSelect}
                />
            )}
            {/* 3단계: 가는날 교통편 선택 모달 */}
            {step === 3 && (
                <TransportSelectModal
                    date={dateRange.startDate}
                    time={times.startDepart}
                    mode="go"
                    onNext={handleGoTransportSelect}
                    onClose={() => setStep(2)}
                />
            )}
            {/* 4단계: 오는날 교통편 선택 모달 + 이전 버튼 */}
            {step === 4 && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #cccccc", padding: 32, minWidth: 420, textAlign: "center", position: "relative" }}>
                        {/* 이전 버튼 */}
                        <button
                            style={{
                                position: "absolute", left: 24, top: 24, background: "#eee", color: "#333", border: "1px solid #ccc", borderRadius: 8, padding: "8px 20px", fontSize: 15, cursor: "pointer"
                            }}
                            onClick={handleBackToGo}
                        >
                            ← 가는날로 돌아가기
                        </button>
                        {/* TransportSelectModal 내용 */}
                        <TransportSelectModal
                            date={dateRange.endDate}
                            time={times.endDepart}
                            mode="return"
                            onSelect={handleReturnTransportSelect}
                            onClose={() => setStep(3)}
                            onBack={handleBackToGo}
                        />
                    </div>
                </div>
            )}
            {/* 5단계: 완료 화면 */}
            {step === 5 && (
                <div style={{ textAlign: "center", marginTop: 100, padding: "0 20px" }}>
                    <h2 style={{ marginBottom: 32, color: "#333" }}>교통편 선택 완료!</h2>
                    
                    {/* 가는날 정보 */}
                    <div style={{ 
                        background: "#f8f9fa", 
                        borderRadius: 12, 
                        padding: 24, 
                        marginBottom: 20, 
                        border: "1px solid #e9ecef",
                        textAlign: "left"
                    }}>
                        <h3 style={{ color: "#495057", marginBottom: 16, fontSize: 18 }}>가는날</h3>
                        <div style={{ fontSize: 16, lineHeight: 1.6 }}>
                            <div style={{ marginBottom: 8 }}>
                                <b style={{ color: "#495057" }}>날짜:</b> {dateRange && formatDate(dateRange.startDate)}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <b style={{ color: "#495057" }}>출발시간:</b> {times && times.startDepart}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <b style={{ color: "#495057" }}>교통편:</b> {goTransport ? (
                                    <span>
                                        {goTransport.departureTime} - {goTransport.arrivalTime} 
                                        ({goTransport.type === "train" ? "기차" : "버스"})
                                    </span>
                                ) : "-"}
                            </div>
                            <div>
                                <b style={{ color: "#495057" }}>구간:</b> {goTransport ? `${goTransport.departure} → ${goTransport.arrival}` : "-"}
                            </div>
                        </div>
                    </div>

                    {/* 오는날 정보 */}
                    <div style={{ 
                        background: "#f8f9fa", 
                        borderRadius: 12, 
                        padding: 24, 
                        marginBottom: 32, 
                        border: "1px solid #e9ecef",
                        textAlign: "left"
                    }}>
                        <h3 style={{ color: "#495057", marginBottom: 16, fontSize: 18 }}>오는날</h3>
                        <div style={{ fontSize: 16, lineHeight: 1.6 }}>
                            <div style={{ marginBottom: 8 }}>
                                <b style={{ color: "#495057" }}>날짜:</b> {dateRange && formatDate(dateRange.endDate)}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <b style={{ color: "#495057" }}>출발시간:</b> {times && times.endDepart}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <b style={{ color: "#495057" }}>교통편:</b> {returnTransport ? (
                                    <span>
                                        {returnTransport.departureTime} - {returnTransport.arrivalTime} 
                                        ({returnTransport.type === "train" ? "기차" : "버스"})
                                    </span>
                                ) : "-"}
                            </div>
                            <div>
                                <b style={{ color: "#495057" }}>구간:</b> {returnTransport ? `${returnTransport.departure} → ${returnTransport.arrival}` : "-"}
                            </div>
                        </div>
                    </div>

                    {/* 다시 시작 버튼 */}
                    <button
                        style={{
                            background: "#111",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "12px 32px",
                            fontSize: 16,
                            cursor: "pointer",
                            marginTop: 16
                        }}
                        onClick={() => {
                            setStep(1);
                            setDateRange(null);
                            setTimes(null);
                            setGoTransport(null);
                            setReturnTransport(null);
                        }}
                    >
                        다시 시작하기
                    </button>
                </div>
            )}
        </div>
    );
}

export default StartPlannerPage;