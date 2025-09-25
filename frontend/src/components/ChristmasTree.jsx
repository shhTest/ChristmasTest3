// ChristmasTree.jsx
import React from "react";

const ChristmasTree = ({ emojis }) => {
  return (
    <div style={{ textAlign: "center" }}>
      {/* 樹葉 */}
      <div
        style={{
          margin: "0 auto",
          marginTop: "150px",
          width: 0,
          borderLeft: "200px solid transparent",
          borderRight: "200px solid transparent",
          borderBottom: "400px solid green",
          position: "relative",
        }}
      ></div>

      {/* 樹幹 */}
      <div
        style={{
          width: "40px",
          height: "80px",
          backgroundColor: "sienna",
          margin: "0 auto",
          marginTop: "-10px",
        }}
      ></div>

      {/* 樹底下固定彩燈 */}
      <div style={{ fontSize: "32px", marginTop: "10px" }}>
        {emojis.map((emoji, idx) => (
          <span key={idx} style={{ margin: "0 5px" }}>
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ChristmasTree;
