import { useState, useEffect } from "react";
import { getDate } from "../utils";
function Clock({ clr }) {
  const [date, setDate] = useState(new Date());

  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);
  return (
    <div className="parent-div">
      <span style={{ fontWeight: 500, fontSize: "3em", color: clr }}>
        {date.toLocaleTimeString()}
      </span>
      <br></br>
      <span style={{ fontWeight: 300, color: clr }}>{getDate()}</span>
    </div>
  );
}
export default Clock;
