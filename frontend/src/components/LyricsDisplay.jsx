import React from "react";

const LyricsDisplay = ({ lines }) => (
  <div style={{ marginTop: "30px", fontSize: "24px", lineHeight: "2em" }}>
    {lines.map((line, idx) => (
      <div key={idx}>{line}</div>
    ))}
  </div>
);

export default LyricsDisplay;
