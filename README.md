# SkyCast

SkyCast is a responsive weather app built with Vite, React, TypeScript, and Tailwind CSS. It uses Open-Meteo for forecast data and geocoding, supports current-location weather, saved locations, 24-hour and 7-day forecasts, and automatic light/dark theming based on local time.

## Features

- Search for cities with Open-Meteo geocoding suggestions.
- Automatically load weather for the user's current location on first visit.
- Display current temperature, weather condition, feels-like temperature, humidity, wind speed, precipitation, sunrise, and sunset.
- Switch between daily and hourly forecasts.
- Drag-scroll the hourly forecast list with mouse or pointer input.
- Save frequently checked locations with `localStorage`.
- Automatically use light mode from 6am to 6pm and dark mode from 6pm to 6am.
- Manually toggle light/dark mode for the current session without saving the override.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Open-Meteo Forecast API
- Open-Meteo Geocoding API

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Project Structure

```text
src/
  components/
    layout/        App shell and page layout
    locations/     Saved locations UI
    search/        City search and suggestions
    theme/         Theme provider, context, and toggle
    weather/       Current, daily, and hourly weather components
  hooks/           Time-based theme hook
  services/        Open-Meteo data fetching and transforms
  types/           Shared TypeScript interfaces
```

## Data Source

SkyCast uses the free Open-Meteo APIs:

- Forecast: `https://api.open-meteo.com/v1/forecast`
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`

No API key is required.

## Theme Behavior

The app uses Tailwind's `darkMode: "class"` strategy. The theme hook checks the user's local hour:

- Light mode: `6:00` to `17:59`
- Dark mode: `18:00` to `5:59`

Manual toggles are kept in memory only. Refreshing the page returns the app to the time-based theme.
