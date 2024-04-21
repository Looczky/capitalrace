import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stopwatch from './Stopwatch';
import shuffle from './utils';
import MapChart from './MapChart';

function Game() {
  const [remaining, setRemaining] = useState(10);
  const [countries, setCountries] = useState([]);
  const [countriesLeft, setCountriesLeft] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [currentCountry, setCurrentCountry] = useState('');
  const [currentCapital, setCurrentCapital] = useState('');
  const [currentIndex,setCurrentIndex] = useState(null);
  const [pauseTimer,setPauseTimer] = useState(true);
  const [resetTimer,setResetTimer] = useState(false);
  const [gameRunning,setGameRunning] = useState(true);
  const [inputFocus,setInputFocus] = useState(false);

  function handleInputChange(event){
    setInputValue(event.target.value);
  }

  function updateCorrect(){
    const newResults = [...results, currentCountry];
    setResults(newResults);
    const newCountrySet = countriesLeft.filter((_,index)=>index !== currentIndex);
    setCountriesLeft(newCountrySet);
    setInputValue('');
  }

  function updateToRandomIndex(){
    
    const random_index = Math.floor(Math.random()*countriesLeft.length);
    setCurrentIndex(random_index);
    updateCountry(random_index)
  }

  
  function updateCountry(index){
    const chosen_value = countriesLeft[index];
    setCurrentCountry(chosen_value['name']);
    setCurrentCapital(chosen_value['capital']);
  }
  
  function handleSkip(){
    updateToRandomIndex();
    setInputValue('');
  }
  
  function stopGame(){
    setGameRunning(false);
  }

  useEffect(()=>{
    if (countriesLeft === null){
      return
    }
    setRemaining(countriesLeft.length);
    if (countriesLeft.length>0){
      updateToRandomIndex();
    }
    else{
      stopGame();
    }
  },[countriesLeft])
  
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
          handleSkip()
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  })

  useEffect(()=>{
    if (countries.length > 0){
      initializeGameSetup()
    }
  },[countries])

  useEffect(()=>{
    if (inputValue === '')
      return;
    if (inputValue.toLowerCase() === currentCapital.toLowerCase()){
      updateCorrect();

      if (pauseTimer) setPauseTimer(false);
    }
  },[inputValue]);

  function initializeGameSetup(){
    setCountriesLeft(countries);
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
      {gameRunning? (
      <div>
        <div class='row'>
          <div class='col'>
            <Stopwatch isPaused={pauseTimer} doReset={resetTimer}></Stopwatch>
          </div>
        </div>
      </div>
      ) : (
        <div>
          <div class='row'>
            <div class='col-md-6'>
              <Stopwatch isPaused={pauseTimer} doReset={resetTimer}></Stopwatch>
            </div>
            <div class='col-md-6'>
              <p style={{fontSize: '5rem', textAlign:'center'}}>{Math.round(results.length * 100 / countries.length)}%</p>
            </div>
          </div>
        </div>
      )
      }
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
            <button type="button" class="btn btn-warning" onClick={handleSkip}>Skip</button>
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
        {countries.map((countrySet, index) => (
          <div class='col-sm-3' key={index}>
          <p style={{color: results.includes(countrySet['name'])? 'green': 'red', visibility: results.includes(countrySet['name']) ? 'visible': gameRunning? 'hidden':'visible'}}>
            {countrySet['name']} {countrySet['capital']}
          </p>
        </div>
      ))}
      </div>
    </div>
  );
}

export default Game;