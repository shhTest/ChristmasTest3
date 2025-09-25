import React from "react";

const CountdownDisplay = ({ seconds }) => {
  if (seconds === null) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "160px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "28px",
      }}
    >
      <span style={{ color: "#FF69B4" }}>🎄 距離聖誕還有 {seconds} 秒 🎄</span>
      <span style={{ color: "#BBFFFF" }}> - 後端主動通知：SSE 伺服器即時推送</span>
    </div>
  );
};

export default CountdownDisplay;
