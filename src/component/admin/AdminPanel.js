import React, { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../../config";

const TOKEN_KEY = "weather_admin_token";

export default function AdminPanel({ onBack, onRefreshMainRegions }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);

  const emptyForm = useMemo(
    () => ({ id: null, name: "", key: "", lat: "", lon: "", type: "Center" }),
    []
  );
  const [form, setForm] = useState(emptyForm);

  async function fetchRegions() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/regions`);
      const data = await res.json();
      setRegions(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr("Failed to load regions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRegions();
  }, []);

  async function login(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setPassword("");
    } catch (e2) {
      setErr(e2.message);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  }

  async function saveRegion(e) {
    e.preventDefault();
    setErr("");

    const payload = {
      name: form.name.trim(),
      key: form.key.trim(),
      lat: Number(form.lat),
      lon: Number(form.lon),
      type: form.type,
    };

    if (!payload.name || !payload.key || Number.isNaN(payload.lat) || Number.isNaN(payload.lon) || !payload.type) {
      setErr("Please fill all fields correctly");
      return;
    }

    const isEdit = Boolean(form.id);

    try {
      const res = await fetch(
        isEdit ? `${API_BASE}/admin/regions/${form.id}` : `${API_BASE}/admin/regions`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");

      setForm(emptyForm);
      await fetchRegions();
      if (onRefreshMainRegions) await onRefreshMainRegions();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  function editRegion(r) {
    setForm({
      id: r.id,
      name: r.name,
      key: r.key,
      lat: String(r.lat),
      lon: String(r.lon),
      type: r.type,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteRegion(id) {
    if (!window.confirm("Delete this region?")) return;
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/admin/regions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Delete failed");
      await fetchRegions();
      if (onRefreshMainRegions) await onRefreshMainRegions();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 12,
    background: "white",
  };

  return (
    <div style={{ maxWidth: 980, margin: "20px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Admin Panel</h2>
        <button onClick={onBack} style={{ padding: "8px 12px" }}>← Back</button>
      </div>

      {err ? (
        <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: "#ffe6e6", color: "#7a1a1a" }}>
          {err}
        </div>
      ) : null}

      <div style={{ marginTop: 16, display: "grid", gap: 14 }}>
        {!token ? (
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Login</h3>
            <form onSubmit={login} style={{ display: "grid", gap: 10, maxWidth: 380 }}>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
              <button type="submit" style={{ padding: "10px 12px" }}>Login</button>
              <small style={{ opacity: 0.75 }}>
                Default: <b>admin / admin123</b> (from DB seed)
              </small>
            </form>
          </div>
        ) : (
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <b>Logged in</b>
              </div>
              <button onClick={logout} style={{ padding: "8px 12px" }}>Logout</button>
            </div>
          </div>
        )}

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>{form.id ? "Edit Region" : "Add Region"}</h3>
          <form onSubmit={saveRegion} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
            <input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="Key (unique)" />
            <input value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="Latitude" />
            <input value={form.lon} onChange={(e) => setForm({ ...form, lon: e.target.value })} placeholder="Longitude" />

            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="Center">Center</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="Bekaa">Bekaa</option>
            </select>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setForm(emptyForm)} style={{ padding: "10px 12px" }}>
                Clear
              </button>
              <button type="submit" disabled={!token} style={{ padding: "10px 12px" }}>
                {form.id ? "Update" : "Create"}
              </button>
            </div>
          </form>
          {!token ? (
            <small style={{ display: "block", marginTop: 10, opacity: 0.75 }}>
              Login is required to Create/Update/Delete.
            </small>
          ) : null}
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <h3 style={{ marginTop: 0, marginBottom: 0 }}>Regions</h3>
            <button onClick={fetchRegions} style={{ padding: "8px 12px" }}>Refresh</button>
          </div>

          {loading ? (
            <p>Loading…</p>
          ) : regions.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No regions found.</p>
          ) : (
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              {regions.map((r) => (
                <div key={r.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <div>
                      <b>{r.name}</b> — {r.type}
                      <div style={{ opacity: 0.8, fontSize: 13 }}>
                        key: {r.key} | lat: {r.lat} | lon: {r.lon}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => editRegion(r)} style={{ padding: "8px 12px" }}>
                        Edit
                      </button>
                      <button onClick={() => deleteRegion(r.id)} disabled={!token} style={{ padding: "8px 12px" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
