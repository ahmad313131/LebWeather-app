import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";

const KEY = "weather_settings_v1";

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function saveSettings(s) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

function applyDark(dark) {
  document.body.classList.toggle("dark", !!dark);
}

export default function SettingsPage() {
  const { i18n } = useTranslation();
  const [unit, setUnit] = useState("metric"); // metric|imperial
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState(i18n.language || "en");

  useEffect(() => {
    const s = loadSettings();
    if (s.unit) setUnit(s.unit);
    if (typeof s.dark === "boolean") setDark(s.dark);
    if (s.lang) setLang(s.lang);
  }, []);

  useEffect(() => {
    saveSettings({ unit, dark, lang });
    applyDark(dark);
    window.dispatchEvent(new Event("weather-settings-changed"));
    if (lang && lang !== i18n.language) i18n.changeLanguage(lang);
  }, [unit, dark, lang, i18n]);

  return (
    <Container maxWidth="sm" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Settings
      </Typography>

      <Typography sx={{ fontWeight: 800, mb: 1 }}>Temperature Unit</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant={unit === "metric" ? "contained" : "outlined"}
          onClick={() => setUnit("metric")}
          sx={{ fontWeight: 800 }}
        >
          Celsius (°C)
        </Button>
        <Button
          variant={unit === "imperial" ? "contained" : "outlined"}
          onClick={() => setUnit("imperial")}
          sx={{ fontWeight: 800 }}
        >
          Fahrenheit (°F)
        </Button>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography sx={{ fontWeight: 800, mb: 1 }}>Language</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant={lang === "en" ? "contained" : "outlined"}
          onClick={() => setLang("en")}
          sx={{ fontWeight: 800 }}
        >
          English
        </Button>
        <Button
          variant={lang === "ar" ? "contained" : "outlined"}
          onClick={() => setLang("ar")}
          sx={{ fontWeight: 800 }}
        >
          العربية
        </Button>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <FormControlLabel
        control={<Switch checked={dark} onChange={(e) => setDark(e.target.checked)} />}
        label="Dark mode"
      />

      <Typography sx={{ opacity: 0.75, mt: 2 }}>
        Note: Unit + language are saved in localStorage. Weather cards will update automatically.
      </Typography>
    </Container>
  );
}
