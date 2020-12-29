import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import allCityData from "./data/Israel.json";
import Container from "react-bootstrap/container";
import Jumbotron from "react-bootstrap/jumbotron";
import Col from "react-bootstrap/col";
import Row from "react-bootstrap/row";

import Navbar from "react-bootstrap/navbar";

export default function App() {
  const styles = {
    height: "250px",
    width: "100vw"
    
  };
  

  const [viewport, setViewport] = useState({
    latitude: 31.712068799999997,
    longitude: 35.0037891,
    zoom: 10,
    width: "80vw",
    height: "80vh",
    justifyContent: "center",
  });

  const cityData = allCityData.filter(city=>city.population>100000)
  let number = Math.floor(Math.random() * cityData.length)
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchCity, setSearchCity] = useState(cityData[number]);
  const [numberCorrect, setNumberCorrect] = useState(0);
  const [numberClicks, setNumberClicks] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedCity(null);
        setSearchCity(cityData[Math.floor(Math.random() * cityData.length)]);
        setButtonDisabled(false)
      }
    };
    window.addEventListener("keydown", listener);
    
  }, [])

  

  return (
    <div style={{ background: "white", height: "100px", width: "100px", marginLeft: "2vw", marginRight: "2vw"}}>
      <Container style={styles}>
        <Navbar>
          <h1>Find the Israeli City!</h1>
          <hr/>
        </Navbar>


        <Container>
          <h2>This app will help you learn the location of cities in Israel that have a population greater than 100,000.</h2>
          <h2>The number of cities in Israel with a population over 100,000 is {cityData.length}.</h2>
          <hr/>
          <h3>{searchCity.city}</h3>
                <button disabled={buttonDisabled} style={{display: "block"}} onClick={(e) => {
                  e.preventDefault();
                  setSearchCity(cityData[Math.floor(Math.random() * cityData.length)]);
                
                }}
                >Select New City</button>
            
              {selectedCity===searchCity ? <h3>Correct</h3>: <h3>Try Again</h3>}
        </Container>
        <hr/>
        <Container>  
          <h3>Number of guesses: {numberClicks}</h3>
          <h3>Number correct: {numberCorrect}</h3>
        </Container>
        <div>


        <Jumbotron style={{width: "80vw", paddingTop: "25px", paddingBottom: "25px", paddingLeft: "100px", paddingRight: "100px", background: "gray"}}>
          <ReactMapGL 
            {...viewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            onViewportChange={(viewport) => {
              setViewport(viewport);
            }}
            mapStyle="mapbox://styles/yehuda1977/ckj6wk72bevyq19sz20iqwmue"
          >
            {cityData.map((city) => (
              <Marker key={city.id} latitude={city.lat} longitude={city.lng}>
                
                <button disabled={buttonDisabled} style={{background:"none", border: "none"}}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCity(city);
                    setNumberClicks(numberClicks+1);
                    if (city===searchCity) {
                      setNumberCorrect(numberCorrect+1)
                      setButtonDisabled(true)
                    }
                  }}
                >
                  <img src="/star.svg" alt="star"/>
                </button>

              </Marker>
            ))}
            
            {selectedCity===searchCity && (
              <Popup 
                latitude={selectedCity.lat} 
                longitude={selectedCity.lng}
                onClose={() => {
                  setSelectedCity(null);
                  setSearchCity(cityData[Math.floor(Math.random() * cityData.length)]);
                  setButtonDisabled(false)
                }}
              >
                <div>
                  <h3>{selectedCity.city}</h3>
                  population:{selectedCity.population}
                </div>
              </Popup>
            )}
          </ReactMapGL>
        </Jumbotron>
        </div>
      </Container>
    </div>
  );
}
