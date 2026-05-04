import { useRef, useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import SearchBar from "./components/search/SearchBar";
import CurrentWeatherCard from "./components/weather/CurrentWeatherCard";
import {
  fetchWeather,
  type LocationResult,
  type WeatherData,
} from "./services/weatherService";

const formatLocationName = (location: LocationResult): string =>
  [location.name, location.admin1, location.country].filter(Boolean).join(", ");

function App() {
  const requestIdRef = useRef(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  const handleLocationSelect = async (location: LocationResult) => {
    const requestId = requestIdRef.current + 1;

    requestIdRef.current = requestId;
    setSelectedCity(formatLocationName(location));
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

  return (
    <AppLayout>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 pt-8 sm:pt-12 lg:pt-16">
        <h1 className="font-display text-4xl font-bold leading-tight text-neutral-0 sm:text-5xl">
          Weather
        </h1>
        <SearchBar onLocationSelect={handleLocationSelect} />

        {isWeatherLoading ? (
          <div className="rounded-lg border border-neutral-600 bg-neutral-800 p-6 text-base font-medium text-neutral-200">
            Loading current weather...
          </div>
        ) : null}

        {weatherError !== "" ? (
          <div className="rounded-lg border border-neutral-600 bg-neutral-800 p-6 text-base font-medium text-neutral-200">
            {weatherError}
          </div>
        ) : null}

        {!isWeatherLoading && weatherData ? (
          <CurrentWeatherCard cityName={selectedCity} weather={weatherData.current} />
        ) : null}
      </section>
    </AppLayout>
  );
}

export default App;
