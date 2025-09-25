import React from "react";

const LuckyNumberDisplay = ({ number }) => {
  if (number === null) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "28px",
        color: "#FF0000",
		whiteSpace: "nowrap",
      }}
    >
      🎉 明年幸運數字: {number} 🎉 - 前端主動Polling：每5秒定期發送請求詢問後端）
    </div>
  );
};

export default LuckyNumberDisplay;
