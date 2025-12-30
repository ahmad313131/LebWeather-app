import "./App.css";
import Home from "./component/HomeComponent";
import NavBar from "./component/NavBar";
import MapPage from "./component/pages/MapPage";
import FavoritesPage from "./component/pages/FavoritesPage";
import SettingsPage from "./component/pages/SettingsPage";
import ContactPage from "./component/pages/ContactPage";
import { RegionsContext } from "./context/RegionContext";
import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "./config";
import AdminPanel from "./component/admin/AdminPanel";

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || "");
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || "");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  const path = useMemo(() => {
    const h = (hash || "#/").toLowerCase();
    // keep original case for display routing
    const raw = (hash || "#/").replace(/^#/, "");
    return raw || "/";
  }, [hash]);

  const isAdmin = useMemo(() => (path || "").toLowerCase() === "/admin", [path]);
  const cleanPath = useMemo(() => (path || "/").split("?")[0], [path]);

  const [lebanonRegions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Apply saved UI settings (dark mode) on app start
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("weather_settings_v1") || "{}");
      if (s && typeof s.dark === "boolean") {
        document.body.classList.toggle("dark", !!s.dark);
      }
    } catch {}
  }, []);

  async function loadRegions() {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch(`${API_BASE}/regions`);
      const data = await res.json();
      setRegions(Array.isArray(data) ? data : []);
    } catch (e) {
      setRegions([]);
      setLoadError("Could not load regions from backend. Is the Node server running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRegions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goAdmin() {
    window.location.hash = "#/admin";
  }
  function goHome() {
    window.location.hash = "#/";
  }

  return (
    <div className="App">
      <RegionsContext.Provider value={{ lebanonRegions, reloadRegions: loadRegions }}>
        {isAdmin ? (
          <AdminPanel onBack={goHome} onRefreshMainRegions={loadRegions} />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
              <h3 style={{ margin: 0 }}>Weather Lebanon</h3>
              <button onClick={goAdmin} style={{ padding: "8px 12px" }}>
                Admin
              </button>
            </div>

            <NavBar activePath={cleanPath} />

            {cleanPath === "/map" ? (
              <MapPage regions={lebanonRegions} loading={loading} error={loadError} />
            ) : cleanPath === "/favorites" ? (
              <FavoritesPage />
            ) : cleanPath === "/settings" ? (
              <SettingsPage />
            ) : cleanPath === "/contact" ? (
              <ContactPage />
            ) : (
              <Home />
            )}
          </>
        )}
      </RegionsContext.Provider>
    </div>
  );
}
