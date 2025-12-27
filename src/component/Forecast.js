import Typography from "@mui/material/Typography";
import moment from "moment";

export default function Forecast({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div style={{ marginTop: "15px" }}>
      <Typography variant="h6">5-Day Forecast</Typography>
      <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
        {forecast.map((day) => (
          <div
            key={day.date}
            style={{
              padding: "10px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.2)",
              minWidth: "80px",
              textAlign: "center",
            }}
          >
            <Typography variant="body2">
              {moment(day.date).format("ddd")}
            </Typography>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt="icon"
            />
            <Typography variant="body1">{day.temp}°</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
