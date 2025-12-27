import * as React from "react";
import Container from "@mui/material/Container";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useContext, useState, useMemo } from "react";
import { RegionsContext } from "../context/RegionContext";
import WeatherCard from "./WeatherCard";

export default function Home() {
  const { t, i18n } = useTranslation();
  const { lebanonRegions } = useContext(RegionsContext);
  const [RegionType, setRegionType] = useState("Center");

  // filter regions
  const regionsByType = useMemo(() => {
    return {
      Center: lebanonRegions.filter((r) => r.type === "Center"),
      South: lebanonRegions.filter((r) => r.type === "South"),
      North: lebanonRegions.filter((r) => r.type === "North"),
      Bekaa: lebanonRegions.filter((r) => r.type === "Bekaa"),
    };
  }, [lebanonRegions]);

  let RegionTobeRendered = regionsByType[RegionType] || lebanonRegions;

  function changeDisplayType(event, newValue) {
    if (newValue !== null) {
      setRegionType(newValue);
    }
  }

  const isRTL = i18n.language === "ar";

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Filter buttons */}
      <ToggleButtonGroup
        color="primary"
        value={RegionType}
        exclusive
        onChange={changeDisplayType}
        aria-label="Region filter"
      >
        <ToggleButton value="Center">{t("Center")}</ToggleButton>
        <ToggleButton value="South">{t("South")}</ToggleButton>
        <ToggleButton value="North">{t("North")}</ToggleButton>
        <ToggleButton value="Bekaa">{t("Bekaa")}</ToggleButton>
      </ToggleButtonGroup>

      {/* Render each region card */}
      {RegionTobeRendered.map((region) => (
        <WeatherCard key={region.name} region={region} />
      ))}

      {/* Language Toggle */}
      <div style={{ marginTop: "15px" }}>
        <Button
          variant="contained"
          onClick={() => i18n.changeLanguage(isRTL ? "en" : "ar")}
        >
          {t("details", { defaultValue: "Details" })}
        </Button>
      </div>
    </Container>
  );
}
