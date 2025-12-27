# 🌤️ React Weather App (Lebanon)

A full-stack Weather application built with **React** and **Node.js**, featuring a dynamic regions system stored in a database and an **Admin Panel** for managing locations.

---

## 🚀 Features

- 🌍 Interactive weather map for Lebanon
- 📡 Real-time weather data
- 🗂️ Regions loaded from a database (not hardcoded)
- 🔐 Admin authentication (JWT)
- 🛠️ Admin Panel:
  - Add regions
  - Edit regions
  - Delete regions
- 🧩 Clean API architecture
- 🗄️ MySQL / MariaDB (XAMPP) database
- 🔄 Easy migration to PostgreSQL

---

## 🧱 Tech Stack

### Frontend
- React
- JavaScript (ES6+)
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- JWT Authentication
- MySQL / MariaDB (XAMPP)
- bcrypt (password hashing)

---



## 📁 Project Structure

---

## 🔐 Admin Panel

Access the admin panel at:


Admin capabilities:
- Secure login
- Full CRUD on regions
- Changes reflect instantly on the map

---

## 🧪 API Overview

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/api/regions` | Fetch all regions |
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/regions` | Create region |
| PUT | `/api/admin/regions/:id` | Update region |
| DELETE | `/api/admin/regions/:id` | Delete region |

---

## 🛡️ Security Notes

- Passwords are stored hashed (bcrypt)
- JWT-based authentication
- `.env` files are excluded from GitHub

---

## 🎯 Purpose

This project demonstrates:
- Full-stack development
- Clean backend API design
- Database-driven UI
- Admin-controlled content
- Production-ready architecture

Ideal for:
- Portfolio
- Academic projects
- Full-stack demos

---

## 📜 License

MIT License


---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```
###2️⃣ Database setup (XAMPP)

Start Apache and MySQL in XAMPP

Open phpMyAdmin: http://localhost/phpmyadmin

Create a database named:
```bash
weather_app
```
##4 Import the SQL file:
```bash
backend/database/schema.sql
```
###3️⃣ Backend setup (Node.js)
```bash
cd backend
npm install
```
##Create .env file:
```bash
cp .env.example .env
```
##Run backend:
```bash
npm run dev
```
##Backend runs on:
```bash
http://localhost:4000
```
###4️⃣ Frontend setup (React)

Open a new terminal:
```bash
npm install
npm start
```
##Frontend runs on:
```bash
http://localhost:3000
```
###🔐 Admin Panel

Open in browser:
```bash
http://localhost:3000/#/admin
Username: admin
Password: admin123
```
