import type { DailyForecast } from "../../services/weatherService";
import { getWeatherCondition } from "./weatherConditions";

interface DailyForecastListProps {
  daily: DailyForecast[];
  className?: string;
}

const formatTemperature = (temperature: number): string =>
  `${Math.round(temperature)}°`;

const formatDay = (date: string): string =>
  new Intl.DateTimeFormat("en", {
    weekday: "long",
  }).format(new Date(`${date}T12:00:00`));

function DailyForecastList({ daily, className = "" }: DailyForecastListProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {daily.map((forecast) => {
        const condition = getWeatherCondition(forecast.weatherCode);

        return (
          <article
            key={forecast.date}
            className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg bg-app-surface-muted p-4 sm:grid-cols-[1fr_auto_auto]"
          >
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-app-text">
                {formatDay(forecast.date)}
              </h3>
              <p className="mt-1 text-sm font-medium text-app-text-muted">
                {condition.description}
              </p>
            </div>

            <img
              src={condition.icon}
              alt=""
              className="size-14 object-contain"
              aria-hidden="true"
            />

            <div className="col-span-2 flex items-center justify-between gap-4 text-base font-bold sm:col-span-1 sm:min-w-32">
              <span className="text-app-text-muted">
                {formatTemperature(forecast.temperatureMin)}
              </span>
              <span className="text-app-text">
                {formatTemperature(forecast.temperatureMax)}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default DailyForecastList;
