import { useEffect, useRef, useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import SavedLocations from "./components/locations/SavedLocations";
import SearchBar from "./components/search/SearchBar";
import ThemeToggle from "./components/theme/ThemeToggle";
import CurrentWeatherCard from "./components/weather/CurrentWeatherCard";
import DailyForecastList from "./components/weather/DailyForecastList";
import HourlyForecastList from "./components/weather/HourlyForecastList";
import type { SavedLocation } from "./types/location";
import {
  fetchWeather,
  type LocationResult,
  type WeatherData,
} from "./services/weatherService";

const SAVED_LOCATIONS_KEY = "weather-app-saved-locations";

const readSavedLocations = (): SavedLocation[] => {
  try {
    const savedLocations = window.localStorage.getItem(SAVED_LOCATIONS_KEY);

    if (!savedLocations) {
      return [];
    }

    const parsedLocations = JSON.parse(savedLocations) as SavedLocation[];

    return Array.isArray(parsedLocations) ? parsedLocations : [];
  } catch {
    return [];
  }
};

const writeSavedLocations = (locations: SavedLocation[]) => {
  try {
    window.localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(locations));
  } catch {
    return;
  }
};

const toSavedLocation = (location: LocationResult): SavedLocation => ({
  id: String(location.id),
  name: location.name,
  latitude: location.latitude,
  longitude: location.longitude,
  timezone: location.timezone,
  admin1: location.admin1,
  country: location.country,
});

const toCurrentSavedLocation = (weatherData: WeatherData): SavedLocation => ({
  id: `current-${weatherData.latitude.toFixed(4)}-${weatherData.longitude.toFixed(4)}`,
  name: "Current location",
  latitude: weatherData.latitude,
  longitude: weatherData.longitude,
  timezone: weatherData.timezone,
});

const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
  if (error.code === error.PERMISSION_DENIED) {
    return "Location access was denied. Search for a city to see the forecast.";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "Unable to detect your location. Search for a city to see the forecast.";
  }

  if (error.code === error.TIMEOUT) {
    return "Location detection timed out. Search for a city to see the forecast.";
  }

  return "Unable to detect your location. Search for a city to see the forecast.";
};

function App() {
  const requestIdRef = useRef(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<SavedLocation | null>(
    null,
  );
  const [savedLocations, setSavedLocations] =
    useState<SavedLocation[]>(readSavedLocations);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  const isSelectedLocationSaved =
    selectedLocation !== null &&
    savedLocations.some((location) => location.id === selectedLocation.id);

  useEffect(() => {
    if (!navigator.geolocation) {
      window.setTimeout(() => {
        setWeatherError(
          "Geolocation is not supported in this browser. Search for a city to see the forecast.",
        );
      }, 0);
      return;
    }

    const requestId = requestIdRef.current + 1;

    requestIdRef.current = requestId;
    window.setTimeout(() => {
      if (requestIdRef.current === requestId) {
        setSelectedCity("Current location");
        setIsWeatherLoading(true);
        setWeatherError("");
      }
    }, 0);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const data = await fetchWeather(coords.latitude, coords.longitude);

          if (requestIdRef.current === requestId) {
            setWeatherData(data);
            setSelectedLocation(toCurrentSavedLocation(data));
          }
        } catch (error) {
          if (requestIdRef.current === requestId) {
            setWeatherData(null);
            setWeatherError(
              error instanceof Error
                ? error.message
                : "Unable to load weather for your current location.",
            );
          }
        } finally {
          if (requestIdRef.current === requestId) {
            setIsWeatherLoading(false);
          }
        }
      },
      (error) => {
        if (requestIdRef.current === requestId) {
          setWeatherData(null);
          setIsWeatherLoading(false);
          setWeatherError(getGeolocationErrorMessage(error));
        }
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
        timeout: 10000,
      },
    );
  }, []);

  const handleLocationSelect = async (location: LocationResult) => {
    await loadWeatherForSavedLocation(toSavedLocation(location));
  };

  const loadWeatherForSavedLocation = async (location: SavedLocation) => {
    const requestId = requestIdRef.current + 1;

    requestIdRef.current = requestId;
    setSelectedCity(
      [location.name, location.admin1, location.country].filter(Boolean).join(", "),
    );
    setSelectedLocation(location);
    setIsWeatherLoading(true);
    setWeatherError("");

    try {
      const data = await fetchWeather(location.latitude, location.longitude);

      if (requestIdRef.current === requestId) {
        setWeatherData(data);
      }
    } catch (error) {
      if (requestIdRef.current === requestId) {
        setWeatherData(null);
        setWeatherError(
          error instanceof Error
            ? error.message
            : "Unable to load current weather.",
        );
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setIsWeatherLoading(false);
      }
    }
  };

  const handleFavoriteToggle = () => {
    if (!selectedLocation) {
      return;
    }

    const nextSavedLocations = isSelectedLocationSaved
      ? savedLocations.filter((location) => location.id !== selectedLocation.id)
      : [selectedLocation, ...savedLocations];

    setSavedLocations(nextSavedLocations);
    writeSavedLocations(nextSavedLocations);
  };

  const handleSavedLocationRemove = (locationId: string) => {
    const nextSavedLocations = savedLocations.filter(
      (location) => location.id !== locationId,
    );

    setSavedLocations(nextSavedLocations);
    writeSavedLocations(nextSavedLocations);
  };

  return (
    <AppLayout>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 pt-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-4xl font-bold leading-tight text-app-text sm:text-5xl">
            SkyCast
          </h1>
          <ThemeToggle />
        </div>

        {!weatherData || isWeatherLoading || weatherError !== "" ? (
          <>
            <SearchBar onLocationSelect={handleLocationSelect} />
            <SavedLocations
              locations={savedLocations}
              activeLocationId={selectedLocation?.id}
              onLocationSelect={loadWeatherForSavedLocation}
              onLocationRemove={handleSavedLocationRemove}
            />

            {isWeatherLoading ? (
              <div className="rounded-lg border border-app-border bg-app-surface p-6 text-base font-medium text-app-text-muted">
                Loading current weather...
              </div>
            ) : null}

            {weatherError !== "" ? (
              <div className="rounded-lg border border-app-border bg-app-surface p-6 text-base font-medium text-app-text-muted">
                {weatherError}
              </div>
            ) : null}
          </>
        ) : null}

        {!isWeatherLoading && weatherData ? (
          <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <SearchBar onLocationSelect={handleLocationSelect} />
              <SavedLocations
                locations={savedLocations}
                activeLocationId={selectedLocation?.id}
                onLocationSelect={loadWeatherForSavedLocation}
                onLocationRemove={handleSavedLocationRemove}
              />
              <CurrentWeatherCard
                cityName={selectedCity}
                weather={weatherData.current}
                sunrise={weatherData.daily[0]?.sunrise}
                sunset={weatherData.daily[0]?.sunset}
                canSave={selectedLocation !== null}
                isSaved={isSelectedLocationSaved}
                onFavoriteToggle={handleFavoriteToggle}
              />
              <section className="rounded-lg border border-app-border/70 bg-app-surface/70 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl backdrop-saturate-150 sm:p-5">
                <h2 className="font-display text-2xl font-bold text-app-text">
                  Hourly forecast
                </h2>
                <HourlyForecastList
                  hourly={weatherData.hourly}
                  className="mt-5"
                />
              </section>
            </div>

            <aside className="rounded-lg border border-app-border/70 bg-app-surface/70 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl backdrop-saturate-150 sm:p-5 lg:col-span-1">
              <h2 className="font-display text-2xl font-bold text-app-text">
                Daily forecast
              </h2>
              <DailyForecastList daily={weatherData.daily} className="mt-5" />
            </aside>
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}

export default App;
