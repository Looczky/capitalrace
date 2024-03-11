import React, { useState, useEffect } from 'react';

function Game() {
  const [remaining, setRemaining] = useState(10);

  function handleClick(){
    if (remaining >0)
        setRemaining(remaining - 1);
  }

  return (
    <div>
      <h2>Remaining: {remaining}</h2>
      <button onClick={handleClick}>Woosh!</button>
    </div>
  );
}

export default Game;