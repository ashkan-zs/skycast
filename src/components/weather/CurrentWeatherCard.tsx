import BookmarkButton from "../ui/BookmarkButton";
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
      <div className="today-card relative isolate flex min-h-72 flex-col justify-between gap-6 overflow-hidden bg-cover bg-center p-5 sm:min-h-60 sm:p-8">
        <div className="absolute inset-0 -z-10 bg-neutral-900/20" />

        {canSave ? (
          <BookmarkButton
            isSaved={isSaved}
            onClick={onFavoriteToggle}
            className="absolute right-4 top-4 sm:right-6 sm:top-6"
          />
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex self-stretch flex-col items-start justify-between">
            <div className="min-w-0">
              <p className="pl-2 text-sm font-medium leading-none text-neutral-200">
                Current weather
              </p>
              <h2 className="font-display text-2xl font-bold leading-none text-neutral-0 sm:text-5xl">
                {cityName}
              </h2>
            </div>
            <div className="flex gap-3">
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
                      <p className="text-xs font-medium text-neutral-300">
                        Sunset
                      </p>
                      <p className="text-base font-bold text-neutral-0">
                        {formatTime(sunset)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <img
              src={condition.icon}
              alt=""
              className="size-24 self-start object-contain sm:size-32 sm:self-auto"
              aria-hidden="true"
            />
            {/* <p className="text-md font-semibold text-neutral-200 sm:text-sm">
              {condition.description}
            </p> */}
            <p className="font-display text-7xl font-bold leading-none text-neutral-0 sm:text-8xl">
              {formatTemperature(weather.temperature)}
            </p>
          </div>
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
