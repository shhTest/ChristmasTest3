import React, { useEffect, useState } from "react";

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSnowflake = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        size: Math.random() * 15 + 10,
        duration: Math.random() * 5 + 5,
      };
      setSnowflakes((prev) => [...prev, newSnowflake]);
      setTimeout(() => {
        setSnowflakes((prev) => prev.filter((s) => s.id !== newSnowflake.id));
      }, newSnowflake.duration * 1000);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {snowflakes.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            top: 0,
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            color: "white",
            animation: `fall ${s.duration}s linear`,
          }}
        >
          ❄️
        </div>
      ))}

      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-20px); opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
        `}
      </style>
    </>
  );
};

export default Snowfall;
