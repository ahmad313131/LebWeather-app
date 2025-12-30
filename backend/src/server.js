require("dotenv").config();

const express = require("express");
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { query } = require("./db");
const { authRequired } = require("./auth");

const app = express();
app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (like Postman)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

// Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// PUBLIC: Get regions
app.get("/api/regions", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM regions ORDER BY type, name");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch regions" });
  }
});

// PUBLIC: Contact form (frontend Contact page)
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const safeName = String(name).trim();
  const safeEmail = String(email).trim();
  const safeMessage = String(message).trim();

  if (safeName.length < 2) return res.status(400).json({ error: "Name too short" });
  if (!safeEmail.includes("@")) return res.status(400).json({ error: "Invalid email" });
  if (safeMessage.length < 5) return res.status(400).json({ error: "Message too short" });

  try {
    const result = await query(
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
      [safeName, safeEmail, safeMessage]
    );

    res.json({ ok: true, id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ADMIN: Read contact messages
app.get("/api/admin/contacts", authRequired, async (req, res) => {
  try {
    const rows = await query(
      "SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// OPTIONAL: Favorites per client_id (stored in frontend localStorage)
function getClientId(req) {
  return String(req.headers["x-client-id"] || "").trim();
}

app.get("/api/favorites", async (req, res) => {
  const clientId = getClientId(req);
  if (!clientId) return res.status(400).json({ error: "Missing x-client-id header" });

  try {
    const rows = await query(
      "SELECT city, created_at FROM favorites WHERE client_id = ? ORDER BY created_at DESC",
      [clientId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

app.post("/api/favorites", async (req, res) => {
  const clientId = getClientId(req);
  const { city } = req.body || {};
  if (!clientId) return res.status(400).json({ error: "Missing x-client-id header" });
  if (!city) return res.status(400).json({ error: "Missing city" });

  const safeCity = String(city).trim();
  if (safeCity.length < 2) return res.status(400).json({ error: "City too short" });

  try {
    await query(
      "INSERT IGNORE INTO favorites (client_id, city) VALUES (?, ?)",
      [clientId, safeCity]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to save favorite" });
  }
});

app.delete("/api/favorites", async (req, res) => {
  const clientId = getClientId(req);
  const city = String(req.query.city || "").trim();
  if (!clientId) return res.status(400).json({ error: "Missing x-client-id header" });
  if (!city) return res.status(400).json({ error: "Missing city query param" });

  try {
    await query("DELETE FROM favorites WHERE client_id = ? AND city = ?", [clientId, city]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete favorite" });
  }
});

// ADMIN: Login
// Supports: password_hash (bcrypt) OR password_plain (temporary) and upgrades to hash after first successful login.
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const admins = await query(
      "SELECT * FROM admins WHERE username = ? LIMIT 1",
      [username]
    );
    const admin = admins?.[0];
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    let ok = false;
    if (admin.password_hash) {
      ok = await bcrypt.compare(password, admin.password_hash);
    } else if (admin.password_plain) {
      ok = password === admin.password_plain;
      if (ok) {
        const hash = await bcrypt.hash(password, 10);
        await query(
          "UPDATE admins SET password_hash = ?, password_plain = NULL WHERE id = ?",
          [hash, admin.id]
        );
      }
    }

    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ADMIN: Create region
app.post("/api/admin/regions", authRequired, async (req, res) => {
  const { name, key, lat, lon, type } = req.body || {};

  if (!name || !key || lat === undefined || lon === undefined || !type) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await query(
      "INSERT INTO regions (name, `key`, lat, lon, type) VALUES (?, ?, ?, ?, ?)",
      [
        String(name).trim(),
        String(key).trim(),
        Number(lat),
        Number(lon),
        String(type).trim(),
      ]
    );

    const created = await query("SELECT * FROM regions WHERE id = ?", [
      result.insertId,
    ]);
    res.json(created?.[0] || null);
  } catch (e) {
    res.status(400).json({ error: "Create failed (maybe duplicate key?)" });
  }
});

// ADMIN: Update region
app.put("/api/admin/regions/:id", authRequired, async (req, res) => {
  const id = Number(req.params.id);
  const { name, key, lat, lon, type } = req.body || {};

  if (!id || !name || !key || lat === undefined || lon === undefined || !type) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await query(
      "UPDATE regions SET name=?, `key`=?, lat=?, lon=?, type=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
      [
        String(name).trim(),
        String(key).trim(),
        Number(lat),
        Number(lon),
        String(type).trim(),
        id,
      ]
    );

    const updated = await query("SELECT * FROM regions WHERE id = ?", [id]);
    res.json(updated?.[0] || null);
  } catch (e) {
    res.status(400).json({ error: "Update failed (maybe duplicate key?)" });
  }
});

// ADMIN: Delete region
app.delete("/api/admin/regions/:id", authRequired, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  try {
    await query("DELETE FROM regions WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: "Delete failed" });
  }
});

const port = Number(process.env.PORT || 8080);

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Backend running on http://0.0.0.0:${port}`);
});
