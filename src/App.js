import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import logo from "./images/cloudy.png";

const App = () => {
  const API_KEY = process.env.REACT_APP_WEATHER_APP_API_KEY;

  // State variables
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch weather data based on city name
  const fetchWeather = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Input a valid location");
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data based on user's geolocation
  const fetchWeatherByLocation = async () => {
    if (userLocation) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${API_KEY}`
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Input a valid location");
      } finally {
        setLoading(false);
      }
    }
  };

  // Get user's geolocation
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          setError("Input a valid location");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError("Input a valid location");
    }
  };

  // Call getUserLocation on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <>
      <div className="navbar">
        <h1 className="logo-text">
          <img className="logo-img" alt="logo-img" src={logo} /> WEATHERLY APP
        </h1>
      </div>
      <div className="container">
        <div className="wrapper">
          <div className="weather-search">
            <input
              type="text"
              className="input"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setError(null);
              }}
            />

            <button className="custom-btn search-btn" onClick={fetchWeather}>
              <span>Get weather</span>
            </button>

            <span className="line"></span>

            <button
              className="custom-btn search-btn"
              onClick={fetchWeatherByLocation}
            >
              <span>Get Weather by Location</span>
            </button>
          </div>
          <div className="loader-wrapper">
            {loading && <div className="loader"></div>}
            {error && <p className="error-message">{error}</p>}
          </div>
          {weather && (
            <div className="weather-output">
              <p>
                <i class="fa-solid fa-location-dot"></i>
                {weather.name}
              </p>
              <h1>
                <i class="fa-solid fa-temperature-high"></i>
                {(weather.main.temp - 273.15).toFixed(1)}°C
              </h1>
              <div className="weather-description">
                <p>
                  <i class="fa-solid fa-cloud"></i>
                  {weather.weather[0].description}
                </p>
                <p>
                  <i class="fa-solid fa-droplet"></i> {weather.main.humidity}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
