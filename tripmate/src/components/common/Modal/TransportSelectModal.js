import React, { useState, useMemo } from "react";
import { generateDummyTransports } from "../../../utils/transportDummy";
import TransportForm from "../../transport/TransportForm";

// 날짜 포맷 함수
const formatDate = (date) => {
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" });
};

// 교통편 선택 모달 컴포넌트
const TransportSelectModal = ({ date, time, onSelect, onNext, mode = "go", onClose, onBack }) => {
  // 선택된 교통편 state
  const [selected, setSelected] = useState(null);

  // 더미 데이터 생성 (1시간 간격)
  const dummyList = useMemo(() => {
    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return [
      ...generateDummyTransports({ type: "train", date: dateStr }),
      ...generateDummyTransports({ type: "bus", date: dateStr }),
    ];
  }, [date]);

  // 출발시간 이후만 필터링
  const filteredList = dummyList.filter(item => item.departureTime >= time);

  // 다음/완료 버튼 클릭 핸들러
  const handleNext = () => {
    if (!selected) return;
    if (mode === "go" && onNext) {
      onNext(selected);
    } else if (mode === "return" && onSelect) {
      onSelect(selected);
    }
  };

  return (
    // 모달 배경
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      {/* 모달 카드 */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #cccccc", padding: 32, minWidth: 420, textAlign: "center", position: "relative" }}>
        {/* 타이틀 */}
        <h1 style={{ marginBottom: 8 }}>{mode === "go" ? "가는날 교통편 선택" : "오는날 교통편 선택"}</h1>
        {/* 선택한 날짜/시간 정보 */}
        <div style={{ fontSize: 20, color: "#333", marginBottom: 16 }}>
          <b>{mode === "go" ? "가는 날:" : "오는 날:"}</b> {formatDate(date)}<br />
          <b>출발시간:</b> {time}
        </div>
        {/* TransportForm 분리 사용 */}
        <TransportForm
          list={filteredList}
          selected={selected}
          onSelect={setSelected}
        />
        {/* 완료/다음, 닫기 버튼을 아래쪽에 배치 */}
        <div style={{ marginTop: 32 }}>
          <button
            style={{
              marginTop: 8, background: selected ? "#111" : "#ccc", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 32px", fontSize: 16, cursor: selected ? "pointer" : "not-allowed", margin: 10
            }}
            onClick={handleNext}
            disabled={!selected}
          >
            {mode === "go" ? "다음" : "완료"}
          </button>
          <button
            style={{
              marginTop: 8, background: "none", color: "#888", border: "1px solid #ccc",
              borderRadius: 8, padding: "10px 32px", fontSize: 16, cursor: "pointer", margin: 10
            }}
            onClick={onClose}
          >
            닫기
          </button>
        </div>
        {/* onBack이 있으면 이전 버튼을 아래쪽에 표시 (중앙 정렬, 배경/테두리 없음) */}
        {onBack && (
          <button
            style={{
              width: "100%",
              background: "none",
              border: "none",
              color: "#333",
              fontSize: 16,
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: 24,
              textAlign: "center",
              display: "block"
            }}
            onClick={onBack}
          >
            ← 가는날로 돌아가기
          </button>
        )}
      </div>
    </div>
  );
};

export default TransportSelectModal; 