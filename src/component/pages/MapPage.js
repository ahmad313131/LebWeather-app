import React from "react";
import Typography from "@mui/material/Typography";
import WeatherMap from "../WeatherMap";

export default function MapPage({ regions = [], loading = false, error = "" }) {
  return (
    <div style={{ paddingBottom: 24 }}>
      <Typography variant="h5" align="center" sx={{ mt: 2, fontWeight: 800 }}>
        خريطة الطقس في لبنان
      </Typography>

      {error ? (
        <Typography align="center" sx={{ color: "#b00020", mt: 1 }}>
          {error}
        </Typography>
      ) : null}

      {loading ? (
        <Typography align="center" sx={{ mt: 2 }}>
          Loading regions…
        </Typography>
      ) : (
        <div style={{ marginTop: 12 }}>
          <WeatherMap key="lebanon-map-page" regions={regions} />
        </div>
      )}
    </div>
  );
}
