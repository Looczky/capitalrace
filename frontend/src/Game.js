import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stopwatch from './Stopwatch';
import shuffle from './utils';
import MapChart from './MapChart';


function Game() {
  const [remaining, setRemaining] = useState(10);
  const [countries, setCountries] = useState([]);
  const [countriesLeft, setCountriesLeft] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [currentCountry, setCurrentCountry] = useState('');
  const [currentCapital, setCurrentCapital] = useState('');
  const [pauseTimer,setPauseTimer] = useState(true);
  const [resetTimer,setResetTimer] = useState(false);
  const [skipCapital,setSkipCapital] = useState(false);
  const [gameRunning,setGameRunning] = useState(true);
  const [inputFocus,setInputFocus] = useState(false);

  function handleInputChange(event){
    setInputValue(event.target.value);
  }

  function updateCorrect(){
    const newResults = [...results, currentCountry]
    setResults(newResults);
    const myIndex = 0;
    updateCountry(myIndex);
    setCountriesLeft(countriesLeft.filter((_,index)=>index!== myIndex));
    setRemaining(remaining-1);
    setInputValue('');
  }

  function updateCountry(index){
    const chosen_value = countriesLeft[index];
    setCurrentCountry(chosen_value['name']);
    setCurrentCapital(chosen_value['capital']);
  }

  function handleSkip(){
    const data = [...countriesLeft];
    shuffle(data);
    setCountriesLeft(data);
    updateCountry(0);
    setInputValue('');
  }

  function stopGame(){
    setGameRunning(false);
  }

  useEffect(()=>{
    if(!gameRunning){
      setPauseTimer(true);

    }
  },[gameRunning])

  useEffect(() => {
    axios.get('http://localhost:8000/hello-world/')
        .then(response => {
          const data = response.data.countries;
          shuffle(data);
          setCountries(data);
        })
        .catch(error => {
            console.log(error);
        });
}, []); 

  useEffect(()=>{
    const handleKeyDown = (event) => {
      if (!gameRunning) return
      if (event.code === 'Space') {
        const regex = /[a-zA-Z]/g;
        if (inputValue.match(regex) === null || !inputFocus){
          event.preventDefault();
          setSkipCapital(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  })

  useEffect(()=>{
    if (skipCapital){
      handleSkip();
      setSkipCapital(false);
    }
  },[skipCapital]);


  useEffect(()=>{
    if (countries.length > 0){
      initializeGameSetup()
    }
  },[countries])

  useEffect(()=>{
    if (inputValue === '')
      return;
    if (inputValue.toLowerCase() === currentCapital.toLowerCase()){
      updateCorrect()

      if (pauseTimer) setPauseTimer(false)
    }
  },[inputValue]);

  function initializeGameSetup(){
    const chosen_value = countries[0];
    setCurrentCountry(chosen_value['name']);
    setCurrentCapital(chosen_value['capital']);
    const newCountriesLeft = countries.filter((_,index)=>index!==0);
    setCountriesLeft(newCountriesLeft);
    setRemaining(countries.length);
    setResults([]);
    setResetTimer(true);
  }

  function restartProgress(){
    setGameRunning(true)
    initializeGameSetup()

  }

  function onInputFocus(){
    setInputFocus(true);
  }

  function onInputBlur(){
    setInputFocus(false);
  }

  useEffect(()=>{
    if(resetTimer) setResetTimer(false);
  },[resetTimer])

  return (
    <div>
      <div class='row'>
        <Stopwatch isPaused={pauseTimer} doReset={resetTimer}></Stopwatch>
      </div>
      { gameRunning?(
      <div>
        <div class='row'>
          <div class='d-flex justify-content-center'>
            <h2>Remaining: {remaining}</h2>
          </div>
        </div>
        <div class='row'>
          <div class='d-flex justify-content-center'>
            {countries.length > 0 && (
                <p>{currentCountry}</p>
                )}
          </div>
        </div>
        <div class='row'>
          <div class='d-flex justify-content-center'>
            <input onChange={handleInputChange} value={inputValue} onFocus={onInputFocus} onBlur={onInputBlur}></input> <br></br>
            <button type="button" class="btn btn-danger" onClick={stopGame}>Give up ?</button>
          </div>
        </div>
      </div>
      ) : (
        <div>
          <div class='row'>
            <div class='d-flex justify-content-center'>
              <button type="button" class="btn btn-success" onClick={restartProgress}>Play again</button>
            </div>
          </div>
        </div>
      )
      }
      <div class='row'>
      <MapChart results={results} currentCountry={currentCountry} gameRunning = {gameRunning}></MapChart>
      </div>
    <div class='row'>
        {results.map((result, index) => (
          <div key={index}>
          <p style={{color:'green'}}>{result}</p>
        </div>
      ))}
      </div>
    </div>
  );
}

export default Game;