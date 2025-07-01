import { useState } from "react";

// 교통편 리스트 + 탭 + 페이지네이션 컴포넌트
const TransportForm = ({ list, selected, onSelect }) => {
  // 탭 상태 (기차/버스)
  const [tab, setTab] = useState("train");
  // 현재 페이지네이션 인덱스
  const [page, setPage] = useState(0);
  // 한 페이지에 보여줄 아이템 수
  const PAGE_SIZE = 5;

  // 탭 변경 시 페이지 초기화
  const handleTab = (type) => {
    setTab(type);
    setPage(0);
  };

  // 탭별 필터링
  const filteredList = list.filter(item => item.type === tab);

  // 현재 페이지에 보여줄 리스트 슬라이스
  const pagedList = filteredList.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  
  // 전체 페이지 수
  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);

  return (
    <div>
      {/* 탭 버튼 영역 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        {/* 기차 탭 버튼 */}
        <button
          onClick={() => handleTab("train")}
          style={{
            fontWeight: tab === "train" ? "bold" : "normal",
            borderBottom: tab === "train" ? "2px solid #333" : "none",
            marginRight: 8,
            padding: "6px 18px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: tab === "train" ? "#fff" : "#eee",
            color: "#333",
            fontSize: 16,
            cursor: "pointer",
            minWidth: 80
          }}
        >
          기차
        </button>
        {/* 버스 탭 버튼 */}
        <button
          onClick={() => handleTab("bus")}
          style={{
            fontWeight: tab === "bus" ? "bold" : "normal",
            borderBottom: tab === "bus" ? "2px solid #333" : "none",
            padding: "6px 18px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: tab === "bus" ? "#fff" : "#eee",
            color: "#333",
            fontSize: 16,
            cursor: "pointer",
            minWidth: 80
          }}
        >
          버스
        </button>
      </div>
      {/* 교통편 리스트 렌더링 */}
      <div>
        {pagedList.length === 0 && <div style={{ color: "#888", margin: 24 }}>해당 시간 이후 교통편이 없습니다.</div>}
        {pagedList.map(item => (
          // 교통편 카드
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              border: selected && selected.id === item.id ? "2px solid #111" : "1px solid #eee",
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              cursor: "pointer",
              background: selected && selected.id === item.id ? "#e6f0ff" : "#fafbfc"
            }}
          >
            <div>{item.departureTime} - {item.arrivalTime}</div>
            <div>{item.departure} → {item.arrival}</div>
            <div>{item.price}원</div>
          </div>
        ))}
      </div>
      {/* 페이지네이션 버튼 */}
      <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          style={{ marginRight: 8, padding: "6px 18px", borderRadius: 6, border: "1px solid #ccc", background: page === 0 ? "#eee" : "#fff", color: "#333", cursor: page === 0 ? "not-allowed" : "pointer" }}
        >
          이전
        </button>
        <span style={{ alignSelf: "center", fontSize: 15 }}>{page + 1} / {totalPages === 0 ? 1 : totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages - 1}
          style={{ marginLeft: 8, padding: "6px 18px", borderRadius: 6, border: "1px solid #ccc", background: page >= totalPages - 1 ? "#eee" : "#fff", color: "#333", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer" }}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default TransportForm;