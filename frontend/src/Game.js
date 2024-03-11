import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Game() {
  const [remaining, setRemaining] = useState(10);
  const [countries, setCountries] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/hello-world/')
        .then(response => {
            setCountries(response.data.countries);
        })
        .catch(error => {
            console.log(error);
        });
}, []); 

  useEffect(()=>{
    if (inputValue === '123'){
      console.log('AYYY');
    }
  },[inputValue]);

  function handleClick(){
    if (remaining >0)
        setRemaining(remaining - 1);
  }

  function handleInputChange(event){
    setInputValue(event.target.value);
  }

  return (
    <div>
      <h2>Remaining: {remaining}</h2>
      {countries.length > 0 && (
        <p>{countries[0]['name']}</p>
      )}
      <input onChange={handleInputChange} value={inputValue}></input> <br></br>

      <button onClick={handleClick}>Woosh!</button>
    </div>
  );
}

export default Game;