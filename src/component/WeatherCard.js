import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Forecast from "./Forecast";

export default function WeatherCard({ region }) {
  const { t, i18n } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    // current weather
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${region.lat}&lon=${region.lon}&appid=262239b759f5ba2fdf107e4a853f3dba&units=metric&lang=${i18n.language}`
      )
      .then((res) => {
        setWeather({
          temp: Math.round(res.data.main.temp),
          temp_max: Math.round(res.data.main.temp_max),
          temp_min: Math.round(res.data.main.temp_min),
          Description: res.data.weather[0].description,
          icon: res.data.weather[0].icon, // ✅ أيقونة الطقس
          humidity: res.data.main.humidity,
          wind: res.data.wind.speed,
          sunrise: res.data.sys.sunrise,
          sunset: res.data.sys.sunset,
        });
      });

    // forecast
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${region.lat}&lon=${region.lon}&appid=262239b759f5ba2fdf107e4a853f3dba&units=metric&lang=${i18n.language}`
      )
      .then((res) => {
        const daily = res.data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );
        setForecast(
          daily.map((f) => ({
            date: f.dt_txt,
            temp: Math.round(f.main.temp),
            icon: f.weather[0].icon,
            desc: f.weather[0].description,
          }))
        );
      });
  }, [region, i18n.language]);

  if (!weather) return null;

  return (
    <div
      style={{
        width: "90%",
        borderRadius: "10px",
        color: "white",
        padding: "20px",
        backgroundColor: "rgba(15, 60, 165, 0.7)",
        marginTop: "20px",
      }}
    >
      {/* City name */}
      <Typography variant="h4" style={{ fontWeight: "bold" }}>
        {t(region.name)}
      </Typography>

      {/* Weather Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Typography variant="h2">{weather.temp}°</Typography>
          <Typography>{weather.Description}</Typography>
          <Typography>
            {t("high")}: {weather.temp_max}° | {t("low")}: {weather.temp_min}°
          </Typography>
          <Typography>
            💧 {t("Humidity")}: {weather.humidity}% | 🌬 {t("Wind")}:{" "}
            {weather.wind} m/s
          </Typography>
          <Typography variant="caption">
            🌅 {moment.unix(weather.sunrise).format("HH:mm")} | 🌇{" "}
            {moment.unix(weather.sunset).format("HH:mm")}
          </Typography>
        </div>

        {/* ✅ أيقونة الطقس من OpenWeather */}
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt="weather-icon"
          style={{ width: "120px", height: "120px" }}
        />
      </div>

      {/* Forecast */}
      <Forecast forecast={forecast} />
    </div>
  );
}
