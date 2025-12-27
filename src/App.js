import "./App.css";
import Home from "./component/HomeComponent";
import { RegionsContext } from "./context/RegionContext";
import WeatherMap from "./component/WeatherMap";
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
  const isAdmin = useMemo(() => (hash || "").toLowerCase() === "#/admin", [hash]);

  const [lebanonRegions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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

            <h2 style={{ textAlign: "center", marginTop: "20px" }}>خريطة الطقس في لبنان</h2>

            {loadError ? (
              <p style={{ textAlign: "center", color: "#b00020" }}>{loadError}</p>
            ) : null}

            {loading ? (
              <p style={{ textAlign: "center" }}>Loading regions…</p>
            ) : (
              <WeatherMap key="lebanon-map" regions={lebanonRegions} />
            )}

            <Home />
          </>
        )}
      </RegionsContext.Provider>
    </div>
  );
}
