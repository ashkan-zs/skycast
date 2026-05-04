import type { CurrentWeather } from "../../services/weatherService";
import { getWeatherCondition } from "./weatherConditions";

interface CurrentWeatherCardProps {
  cityName: string;
  weather: CurrentWeather;
  sunrise?: string;
  sunset?: string;
  canSave?: boolean;
  isSaved?: boolean;
  onFavoriteToggle?: () => void;
}

interface WeatherMetric {
  label: string;
  value: string;
}

const formatTemperature = (temperature: number): string =>
  `${Math.round(temperature)}°`;

const formatWindSpeed = (windSpeed: number): string =>
  `${Math.round(windSpeed)} km/h`;

const formatTime = (time: string): string =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(time));

function CurrentWeatherCard({
  cityName,
  weather,
  sunrise,
  sunset,
  canSave = false,
  isSaved = false,
  onFavoriteToggle,
}: CurrentWeatherCardProps) {
  const condition = getWeatherCondition(weather.weatherCode);
  const metrics: WeatherMetric[] = [
    {
      label: "Feels like",
      value: formatTemperature(weather.apparentTemperature),
    },
    {
      label: "Humidity",
      value: `${weather.humidity}%`,
    },
    {
      label: "Wind speed",
      value: formatWindSpeed(weather.windSpeed),
    },
    {
      label: "Precipitation",
      value: `${weather.precipitation} mm`,
    },
  ];

  return (
    <article className="overflow-hidden rounded-lg border border-app-border bg-app-surface shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
      <div className="today-card relative isolate flex min-h-72 flex-col justify-between gap-8 overflow-hidden bg-cover bg-center p-5 sm:min-h-80 sm:p-8">
        <div className="absolute inset-0 -z-10 bg-neutral-900/20" />

        {canSave ? (
          <button
            type="button"
            className={`absolute right-4 top-4 grid size-11 place-items-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-orange-500 sm:right-6 sm:top-6 ${
              isSaved
                ? "text-orange-500"
                : "text-neutral-0 hover:text-neutral-200"
            }`}
            onClick={onFavoriteToggle}
            aria-label={
              isSaved ? "Remove saved location" : "Save current location"
            }
            title={isSaved ? "Remove saved location" : "Save location"}
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill={isSaved ? "currentColor" : "none"}
              aria-hidden="true"
            >
              <path
                d="M6 4.75C6 3.784 6.784 3 7.75 3h8.5C17.216 3 18 3.784 18 4.75v16L12 17l-6 3.75v-16Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-base font-medium text-neutral-200">
              Current weather
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-neutral-0 sm:text-5xl">
              {cityName}
            </h2>
          </div>

          <img
            src={condition.icon}
            alt=""
            className="size-24 self-start object-contain sm:size-32 sm:self-auto"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-display text-7xl font-bold leading-none text-neutral-0 sm:text-8xl">
            {formatTemperature(weather.temperature)}
          </p>
          <p className="text-xl font-semibold text-neutral-0 sm:text-2xl">
            {condition.description}
          </p>
          {sunrise && sunset ? (
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-neutral-900/30 p-3">
                <span className="relative grid size-9 shrink-0 place-items-center text-orange-500">
                  <span className="absolute bottom-2 h-px w-7 bg-current" />
                  <span className="size-4 rounded-full bg-current" />
                </span>
                <div>
                  <p className="text-xs font-medium text-neutral-300">
                    Sunrise
                  </p>
                  <p className="text-base font-bold text-neutral-0">
                    {formatTime(sunrise)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-neutral-900/30 p-3">
                <span className="relative grid size-9 shrink-0 place-items-center text-blue-500">
                  <span className="absolute top-2 h-px w-7 bg-current" />
                  <span className="size-4 rounded-full bg-current" />
                </span>
                <div>
                  <p className="text-xs font-medium text-neutral-300">Sunset</p>
                  <p className="text-base font-bold text-neutral-0">
                    {formatTime(sunset)}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-px bg-app-border sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-app-surface p-4 sm:p-5">
            <dt className="text-sm font-medium text-app-text-muted">
              {metric.label}
            </dt>
            <dd className="mt-2 text-lg font-bold text-app-text sm:text-xl">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default CurrentWeatherCard;
