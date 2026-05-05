# 🌤️ SkyCast — Modern Weather Dashboard

🔗 **Live Demo:** https://skycast-ashkan-zs.vercel.app

---

## ✨ Overview

**SkyCast** is a modern, responsive weather web application built with React and TypeScript.
It delivers real-time weather data with a clean UI and smooth user experience.

This project demonstrates my ability to build **API-driven frontend applications**, manage state effectively, and create scalable, production-ready UI.

---

## 🚀 Features

* 🌍 Auto-detect user location on first visit
* 🔍 Smart city search with suggestions (Open-Meteo geocoding)
* ⭐ Save favorite locations (localStorage)
* 🌡️ Detailed current weather data:

  * Temperature, feels-like, humidity
  * Wind speed, precipitation
  * Sunrise & sunset
* 📊 24-hour and 7-day forecasts
* 🖱️ Drag-to-scroll hourly forecast
* 🌗 Automatic light/dark mode based on local time
* 🎛️ Manual theme toggle (session-based)
* 📱 Fully responsive (mobile-first design)

---

## 🛠️ Tech Stack

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS 4**
* **Open-Meteo APIs**

  * Forecast API
  * Geocoding API

---

## 🧠 What This Project Demonstrates

* Building responsive, production-ready UI
* Working with external APIs and async data
* Component-based architecture in React
* Clean code structure and maintainability
* Real-world UX patterns (search, favorites, theming)

---

## ⚙️ Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run lint checks
npm run lint
```

---

## 🌐 Data Source

SkyCast uses free APIs from **Open-Meteo**:

* Forecast: https://api.open-meteo.com/v1/forecast
* Geocoding: https://geocoding-api.open-meteo.com/v1/search

No API key required.

---

## 🌗 Theme System

The app automatically switches theme based on local time:

* ☀️ Light mode: 06:00 → 17:59
* 🌙 Dark mode: 18:00 → 05:59

Manual toggling is available per session (not persisted).

---

## 📌 Notes

This project is part of my frontend portfolio.
I’m available for freelance work involving:

* React / TypeScript applications
* API integrations
* Responsive UI development

---
