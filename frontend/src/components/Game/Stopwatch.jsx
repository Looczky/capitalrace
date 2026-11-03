import React from "react";
import { formatTime } from "../../utils/utils";
export default function Stopwatch({ seconds }) {
  return (
    <span
      className="timer-value"
      aria-label={`Czas gry: ${formatTime(seconds)}`}
    >
      {formatTime(seconds)}
    </span>
  );
}
