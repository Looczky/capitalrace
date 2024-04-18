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
  const [skipCapital,setSkipCapital] = useState(false);
  

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

  function showResults(){
    return 0
  }

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

    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        setSkipCapital(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
}, []); 

  useEffect(()=>{
    if (skipCapital){
      handleSkip();
      setSkipCapital(false);
    }
  },[skipCapital]);


  useEffect(()=>{
    if (countries.length > 0){
      const chosen_value = countries[0];
      setCurrentCountry(chosen_value['name']);
      setCurrentCapital(chosen_value['capital']);
      const newCountriesLeft = countries.filter((_,index)=>index!==0);
      setCountriesLeft(newCountriesLeft);
      setRemaining(countries.length);
    }
  },[countries])

  useEffect(()=>{
    if (results.length!==0){
      
      console.log('hey i need to change!',results,results.length);
      }
  },[results])

  useEffect(()=>{
    if (inputValue === '')
      return;
    if (inputValue.toLowerCase() === currentCapital.toLowerCase()){
      updateCorrect()

      if (pauseTimer) setPauseTimer(false)
    }
  },[inputValue]);


  return (
    <div>
      <div class='row'>
        <Stopwatch isPaused={pauseTimer}></Stopwatch>
      </div>
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
          <input onChange={handleInputChange} value={inputValue}></input> <br></br>
          <button type="button" class="btn btn-danger">Give up ?</button>
        </div>
      </div>
      <div class='row'>

      <MapChart results={results} currentCountry={currentCountry}></MapChart>
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