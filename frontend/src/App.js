import React, { useEffect, useState } from "react";
import ChristmasTree from "./components/ChristmasTree";
import Snowfall from "./components/Snowfall";
import CountdownDisplay from "./components/CountdownDisplay";
import LuckyNumberDisplay from "./components/LuckyNumberDisplay";
import LyricsDisplay from "./components/LyricsDisplay";

/**
 * App.jsx
 * 主要職責：
 *  - 前端主動從 Django 取得資料（fetch / poll）
 *  - 接收後端推送（SSE EventSource）
 *  - 組合 UI 元件（聖誕樹、雪花、倒數、歌詞）
 *
 * EN:
 * Responsibilities:
 *  - Client-initiated data fetching from Django (fetch / polling)
 *  - Receive backend push updates via SSE (EventSource)
 *  - Compose UI components (tree, snowfall, countdown, lyrics)
 */

const App = () => {
  // ---------- 狀態（state）宣告 ----------
  // lyrics: 從後端一次取得整首歌詞（陣列）
  // EN: full lyrics array fetched from backend
  const [lyrics, setLyrics] = useState([]);

  // displayedLyrics: 逐行顯示在畫面上的歌詞（會慢慢 append）
  // EN: lyrics that have been shown line-by-line
  const [displayedLyrics, setDisplayedLyrics] = useState([]);

  // index: 目前要 append 的歌詞索引（用來逐行顯示）
  // EN: index pointer for line-by-line display
  const [index, setIndex] = useState(0);

  // snowflakes: （若你把雪花邏輯放在這裡）雪花陣列
  // 注意：如果你已把 Snowfall 內部管理，這個 state 可以移除
  // EN: snowflakes array (remove if Snowfall handles its own state)
  const [snowflakes, setSnowflakes] = useState([]);

  // luckyNumber: 樹頂顯示的幸運數字（數字或 null）
  // EN: lucky number to show above the tree
  const [luckyNumber, setLuckyNumber] = useState(null);

  // emojis: 樹下固定彩燈（emoji 字串陣列）
  // EN: emoji array for lights under the tree
  const [emojis, setEmojis] = useState([]);

  // countdown: 後端透過 SSE 推送的倒數（秒），或 null
  // EN: countdown seconds pushed from backend via SSE
  const [countdown, setCountdown] = useState(null); // SSE 推送倒數秒數

  // ========================
  // 取得歌詞（前端主動 fetch）
  // endpoint: GET /api/lucky/  -> 回傳 JSON { lyrics: [...] }
  // EN: Fetch lyrics from backend once on mount.
  // ========================
  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const res = await fetch("/api/lucky/");
        const data = await res.json();
        // 假設後端回傳 { lyrics: ["line1", "line2", ...] }
        if (Array.isArray(data.lyrics)) setLyrics(data.lyrics);
      } catch (err) {
        console.error("Lyrics fetch error:", err);
      }
    };
    fetchLyrics();
  }, []);

  // ========================
  // 歌詞逐行顯示（前端操作、client-side animation）
  // 每秒把 lyrics[index] append 到 displayedLyrics，直到結束
  // EN: progressive display of fetched lyrics (1 line / sec)
  // ========================
  useEffect(() => {
    // 如果沒有歌詞或已經到結尾，就不再設定 interval
    if (!lyrics.length || index >= lyrics.length) return;

    const interval = setInterval(() => {
      setDisplayedLyrics((prev) => [...prev, lyrics[index]]);
      setIndex((prev) => prev + 1);
    }, 1000);

    // 清除 interval（component unmount 或依賴改變時）
    return () => clearInterval(interval);
  }, [lyrics, index]);

  // ========================
  // 取得固定彩燈 emojis（前端主動 fetch）
  // endpoint: GET /api/emojis/  -> 假設回傳 { emojis: [{char: "🎄"}, ...] }
  // EN: Fetch an emoji list for the lights under the tree
  // ========================
  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const res = await fetch("/api/emojis/");
        const data = await res.json();
        // 如果後端回傳的是物件陣列 { char: "🎉" }，使用 map 取 char
        if (Array.isArray(data.emojis)) {
          setEmojis(data.emojis.map((e) => e.char));
        }
      } catch (err) {
        console.error("Emojis fetch error:", err);
      }
    };
    fetchEmojis();
  }, []);

  // ========================
  // 取得幸運數字（前端輪詢 polling / 主動抓）
  // endpoint: GET /api/lucky-number/ -> { number: 42 }
  // 行為：頁面載入先抓一次，之後每 5 秒輪詢一次（polling）
  // EN: Poll backend every 5 seconds for updated lucky number
  // ========================
  useEffect(() => {
    const fetchLuckyNumber = async () => {
      try {
        const res = await fetch("/api/lucky-number/");
        const data = await res.json();
        if (typeof data.number === "number") setLuckyNumber(data.number);
      } catch (err) {
        console.error("Lucky number fetch error:", err);
      }
    };

    fetchLuckyNumber(); // 頁面載入先抓一次
    const interval = setInterval(fetchLuckyNumber, 5000); // 每 5 秒抓一次

    return () => clearInterval(interval);
  }, []);

  // ========================
  // SSE 取得倒數秒數（後端主動推送）
  // endpoint: /api/countdown-sse/ （Content-Type: text/event-stream）
  // 後端會以 SSE 格式傳送資料，例如：
  // data: {"seconds": 123}
  //
  // EN:
  // Use EventSource to receive server pushed events.
  // Expected server message data: JSON string like {"seconds":123}
  // ========================
  useEffect(() => {
    const eventSource = new EventSource("/api/countdown-sse/");

    // 當 server 傳來 event 時觸發（使用事件的 data 欄位）
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (typeof data.seconds === "number") setCountdown(data.seconds);
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    // 錯誤處理：記錄並關閉（必要時可改成重試策略）
    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      // 關閉連線，避免無限錯誤
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  // ========================
  // 雪花掉落（這是純 UI 的 client-side 動畫）
  // 如果你已把 Snowfall 這個元件獨立並讓她管理自己的 state，
  // 可把下面的邏輯移除並讓 <Snowfall /> 自己產生雪花。
  //
  // EN:
  // UI-only snowflake generation. If Snowfall component manages
  // its own state, remove this block and internal snowflakes state.
  // ========================
  useEffect(() => {
    const interval = setInterval(() => {
      const newSnowflake = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        size: Math.random() * 15 + 10,
        duration: Math.random() * 5 + 5,
      };

      setSnowflakes((prev) => [...prev, newSnowflake]);

      // 依照雪花的 duration，在前端移除該雪花（防止陣列無限增長）
      setTimeout(() => {
        setSnowflakes((prev) => prev.filter((s) => s.id !== newSnowflake.id));
      }, newSnowflake.duration * 1000);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // ---------- JSX: 組合各個獨立元件 ----------
  return (
    <div
      style={{
        backgroundColor: "black",
        color: "yellow",
        minHeight: "100vh",
        textAlign: "center",
        fontFamily: "monospace",
        position: "relative",
        overflow: "hidden",
        paddingTop: "100px",
      }}
    >
      {/* 幸運數字：前端輪詢取得並置於樹頂上方 */}
      {/* EN: Lucky number retrieved by polling and shown above the tree */}
      <LuckyNumberDisplay number={luckyNumber} />

      {/* 倒數：透過 SSE 後端主動推送 */}
      {/* EN: Countdown pushed from backend via SSE */}
      <CountdownDisplay seconds={countdown} />

      {/* 雪花：UI 動畫（你可以把 snowflakes state 傳給這個元件） */}
      {/* EN: Snow animation. Consider moving snow state inside Snowfall component. */}
      <Snowfall />

      {/* 聖誕樹（獨立元件），傳入 emojis */}
      {/* EN: Christmas tree component with emoji lights */}
      <ChristmasTree emojis={emojis} />

      {/* 歌詞逐行顯示（前端從 fetched lyrics 逐行 append） */}
      {/* EN: Lyrics displayed line-by-line as appended */}
      <LyricsDisplay lines={displayedLyrics} />
    </div>
  );
};

export default App;