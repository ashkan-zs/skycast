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
    <div className={`flex flex-col gap-2 sm:gap-3 ${className}`}>
      {daily.map((forecast) => {
        const condition = getWeatherCondition(forecast.weatherCode);

        return (
          <article
            key={forecast.date}
            className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg bg-app-surface-muted p-3 sm:grid-cols-[1fr_auto_auto] sm:gap-4 sm:p-4"
          >
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-app-text sm:text-base">
                {formatDay(forecast.date)}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-app-text-muted sm:mt-1 sm:text-sm">
                {condition.description}
              </p>
            </div>

            <img
              src={condition.icon}
              alt=""
              className="size-10 object-contain sm:size-14"
              aria-hidden="true"
            />

            <div className="col-span-2 flex items-center justify-between gap-3 text-sm font-bold sm:col-span-1 sm:min-w-32 sm:gap-4 sm:text-base">
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
