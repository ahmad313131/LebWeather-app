import React, { useEffect, useMemo, useState, useContext } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import WeatherCard from "../WeatherCard";
import { RegionsContext } from "../../context/RegionContext";

const KEY = "weather_favorites_v1";

function loadFavs() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function saveFavs(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export default function FavoritesPage() {
  const { lebanonRegions } = useContext(RegionsContext);
  const [favorites, setFavorites] = useState(() => loadFavs());
  const [city, setCity] = useState("");

  useEffect(() => saveFavs(favorites), [favorites]);

  const regionsByName = useMemo(() => {
    const m = new Map();
    (lebanonRegions || []).forEach((r) => m.set(String(r.name || "").toLowerCase(), r));
    return m;
  }, [lebanonRegions]);

  const add = () => {
    const v = city.trim();
    if (!v) return;
    const exists = favorites.some((x) => x.toLowerCase() === v.toLowerCase());
    if (exists) return;
    setFavorites([v, ...favorites]);
    setCity("");
  };

  const remove = (name) => setFavorites(favorites.filter((x) => x !== name));

  const favoriteRegions = useMemo(() => {
    return favorites
      .map((name) => regionsByName.get(name.toLowerCase()))
      .filter(Boolean);
  }, [favorites, regionsByName]);

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        Favorites
      </Typography>
      <Typography sx={{ opacity: 0.8, mb: 2 }}>
        Save Lebanese regions you check often (stored in your browser).
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          label="Add region name (e.g., Nabatieh, Tyre...)"
          size="small"
        />
        <Button variant="contained" onClick={add} sx={{ fontWeight: 800 }}>
          Add
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {favorites.map((name) => (
          <Chip key={name} label={name} onDelete={() => remove(name)} />
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {favoriteRegions.length === 0 ? (
        <Typography sx={{ opacity: 0.75 }}>
          No favorites yet. Add a region name above.
        </Typography>
      ) : (
        <Stack spacing={2} alignItems="center">
          {favoriteRegions.map((r) => (
            <WeatherCard key={r.name} region={r} />
          ))}
        </Stack>
      )}
    </Container>
  );
}
