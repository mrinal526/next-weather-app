"use client"
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

function getCurrentDate() {
  const currentDate = new Date();
  const options = { month: "long" };
  const monthName = currentDate.toLocaleString("en-US", options);
  const date = new Date().getDate() + ", " + monthName;
  return date;
}

const Home = () => {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Bhubaneswar");
  const [unit, setUnit] = useState("metric"); // Default unit is metric (Celsius)

  async function fetchData(cityName) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/weather?address=${cityName}&units=${unit}`
      );
      if (!response.ok) {
        throw new Error("Unable to fetch weather data");
      }
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchDataByCoordinates(latitude, longitude) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}&units=${unit}`
      );
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchDataByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    fetchData(city); // Refetch data with new unit
  };

  return (
    <main className={styles.main}>
      <article className={styles.widget}>
        <form
          className={styles.weatherLocation}
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(city);
          }}
        >
          <input
            className={styles.input_field}
            placeholder="Enter city name"
            type="text"
            id="cityName"
            name="cityName"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className={styles.search_button} type="submit">
            Search
          </button>
        </form>
        {weatherData && weatherData.weather && weatherData.weather[0] ? (
          <>
            <div className={styles.icon_and_weatherInfo}>
              <div className={styles.weatherIcon}>
                {weatherData?.weather[0]?.description === "rain" ||
                weatherData?.weather[0]?.description === "fog" ? (
                  <i
                    className={`wi wi-day-${weatherData?.weather[0]?.description}`}
                  ></i>
                ) : (
                  <i className="wi wi-day-cloudy"></i>
                )}
              </div>
              <div className={styles.weatherInfo}>
                <div className={styles.temperature}>
                  <span>
                    {unit === "metric"
                      ? (weatherData?.main?.temp - 273.5).toFixed(2) +
                        String.fromCharCode(176) + "C"
                      : (weatherData?.main?.temp * 1.8 + 32).toFixed(2) +
                        String.fromCharCode(176) + "F"}
                  </span>
                </div>
                {/* Unit switch */}
            <div>
              <button
                className={styles.unit_buttonC}
                onClick={() => handleUnitChange("metric")}
              >
                Celsius
              </button>
              <button
                className={styles.unit_button}
                onClick={() => handleUnitChange("imperial")}
              >
                Fahrenheit
              </button>
            </div>
                <div className={styles.weatherConditionD}>
                  {weatherData?.weather[0]?.description?.toUpperCase()}
                </div>
                
                <div className={styles.weatherConditionHumidity}>
                  <span>Humidity: </span>
                  {weatherData?.main?.humidity}
                </div>
                <div className={styles.weatherConditionWindSpeed}>
                  <span>Wind Speed: </span>
                  {weatherData?.wind?.speed}
                </div>
              </div>
            </div>

            <div className={styles.place}>{weatherData?.name}</div>
            <div className={styles.date}>{date}</div>

            
          </>
        ) : (
          <div className={styles.place}>Loading...</div>
        )}
      </article>
    </main>
  );
};

export default Home;
