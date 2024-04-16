import React from 'react';
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

  React.useEffect(()=>{
    if (isPaused) pause();
    else start();
  },[isPaused])

  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '100px'}}>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

export default Stopwatch;