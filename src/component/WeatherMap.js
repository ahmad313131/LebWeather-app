import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import { useState as useReactState } from "react";

// أيقونة ماركر حمراء
const redMarkerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component لتحريك الخريطة عند البحث
function MapSearch({ regions }) {
  const map = useMap();
  const [query, setQuery] = useReactState("");

  const handleSearch = () => {
    const city = regions.find(
      (r) => r.name.toLowerCase() === query.toLowerCase()
    );
    if (city) {
      map.setView([city.lat, city.lon], 12);
    } else {
      alert("المدينة غير موجودة");
    }
  };

  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
      <input
        type="text"
        placeholder="ابحث عن مدينة..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "5px" }}
      />
      <button
        onClick={handleSearch}
        style={{ padding: "5px", marginLeft: "5px" }}
      >
        بحث
      </button>
    </div>
  );
}

export default function WeatherMap({ regions }) {
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    regions.forEach((region) => {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${region.lat}&lon=${region.lon}&appid=262239b759f5ba2fdf107e4a853f3dba&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${region.lat}&lon=${region.lon}&appid=262239b759f5ba2fdf107e4a853f3dba&units=metric`;

      axios
        .all([axios.get(weatherUrl), axios.get(forecastUrl)])
        .then(
          axios.spread((currentRes, forecastRes) => {
            const daily = forecastRes.data.list.filter((item) =>
              item.dt_txt.includes("12:00:00")
            );
            setWeatherData((prev) => ({
              ...prev,
              [region.name]: {
                current: currentRes.data.main
                  ? {
                      temp: Math.round(currentRes.data.main.temp),
                      desc: currentRes.data.weather[0]?.description || "",
                      icon: currentRes.data.weather[0]?.icon || "",
                    }
                  : null,
                forecast: daily.map((f) => ({
                  temp: Math.round(f.main?.temp || 0),
                  icon: f.weather[0]?.icon || "",
                })),
              },
            }));
          })
        )
        .catch((err) => console.error("Error fetching weather:", err));
    });
  }, [regions]);

  return (
    <MapContainer
      center={[33.8547, 35.8623]}
      zoom={8}
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%", margin: "20px 0" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <MapSearch regions={regions} />

      {regions.map((region, idx) => (
        <Marker
          key={idx}
          position={[region.lat, region.lon]}
          icon={redMarkerIcon}
        >
          <Popup>
            <b>{region.name}</b>
            <br />
            {weatherData[region.name] && weatherData[region.name].current ? (
              <>
                🌡 {weatherData[region.name].current.temp}°C <br />
                {weatherData[region.name].current.desc} <br />
                {weatherData[region.name].forecast &&
                  weatherData[region.name].forecast.length > 0 && (
                    <div
                      style={{ display: "flex", gap: "5px", marginTop: "5px" }}
                    >
                      {weatherData[region.name].forecast.map((f, i) => (
                        <div
                          key={i}
                          style={{
                            textAlign: "center",
                            background: "rgba(0,0,0,0.1)",
                            padding: "3px",
                            borderRadius: "5px",
                          }}
                        >
                          <img
                            src={`https://openweathermap.org/img/wn/${f.icon}.png`}
                            alt="icon"
                            width={30}
                          />
                          <div>{f.temp}°</div>
                        </div>
                      ))}
                    </div>
                  )}
              </>
            ) : (
              "جارٍ التحميل..."
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
