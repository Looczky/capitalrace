import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Game() {
  const [remaining, setRemaining] = useState(10);
  const [countries, setCountries] = useState([]);
  const [countriesLeft, setCountriesLeft] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [currentCountry, setCurrentCountry] = useState('');
  const [currentCapital, setCurrentCapital] = useState('');

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
    if (countries.length > 0){
      const random_value = Math.round(countries.length * Math.random());
      const chosen_value = countries[random_value];
      setCurrentCountry(chosen_value['name']);
      setCurrentCapital(chosen_value['capital']);
      const newCountriesLeft = countries.filter((_,index)=>index!==random_value);
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
      const newResults = [...results, currentCountry]
      setResults(newResults);

      const random_value = Math.round(countries.length * Math.random());
      const chosen_value = countriesLeft[random_value];
      setCurrentCountry(chosen_value['name']);
      setCurrentCapital(chosen_value['capital']);
      setCountriesLeft(countriesLeft.filter((_,index)=>index!==random_value));
      setRemaining(remaining-1);
      setInputValue('');
    }
  },[inputValue]);

  function handleInputChange(event){
    setInputValue(event.target.value);
  }

  return (
    <div>
      <h2>Remaining: {remaining}</h2>
      {countries.length > 0 && (
        <p>{currentCountry}</p>
      )}
      <input onChange={handleInputChange} value={inputValue}></input> <br></br>
      {results.map((result, index) => (
      <div key={index}>
        <p style={{color:'green'}}>{result}</p>
      </div>
    ))}
    </div>
  );
}

export default Game;