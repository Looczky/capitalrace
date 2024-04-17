import React from 'react';
import { useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';

function Stopwatch({isPaused},{doReset}) {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });

  useEffect(()=>{
    if (isPaused) pause();
    else start();
  },[isPaused])

  if (totalSeconds < 60){
    return (
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: '100px'}}>
          <span>{seconds < 10 ? '0'+seconds: seconds}</span>
        </div>
      </div>
    );
  }
  else if (totalSeconds >= 60){
    return (
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: '100px'}}>
          <span>{minutes < 10 ? '0'+minutes: minutes}</span>:<span>{seconds}</span>
        </div>
      </div>
    );
  }
  else {
    return (
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: '100px'}}>
          <span>{hours < 10 ? '0'+hours:hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
      </div>
    );
  }
}

export default Stopwatch;