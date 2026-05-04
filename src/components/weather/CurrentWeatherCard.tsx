import type { CurrentWeather } from "../../services/weatherService";
import { getWeatherCondition } from "./weatherConditions";

interface CurrentWeatherCardProps {
  cityName: string;
  weather: CurrentWeather;
}

interface WeatherMetric {
  label: string;
  value: string;
}

const formatTemperature = (temperature: number): string =>
  `${Math.round(temperature)}°`;

const formatWindSpeed = (windSpeed: number): string =>
  `${Math.round(windSpeed)} km/h`;

function CurrentWeatherCard({ cityName, weather }: CurrentWeatherCardProps) {
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
    <article className="overflow-hidden rounded-lg border border-neutral-600 bg-neutral-800 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="relative isolate flex min-h-72 flex-col justify-between gap-8 overflow-hidden bg-[url('./assets/images/bg-today-small.svg')] bg-cover bg-center p-5 sm:min-h-80 sm:bg-[url('./assets/images/bg-today-large.svg')] sm:p-8">
        <div className="absolute inset-0 -z-10 bg-neutral-900/20" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-base font-medium text-neutral-200">Current weather</p>
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
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-px bg-neutral-600 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-neutral-800 p-4 sm:p-5">
            <dt className="text-sm font-medium text-neutral-300">
              {metric.label}
            </dt>
            <dd className="mt-2 text-lg font-bold text-neutral-0 sm:text-xl">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default CurrentWeatherCard;
