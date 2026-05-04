import type { DailyForecast } from "../../services/weatherService";
import { getWeatherCondition } from "./weatherConditions";

interface DailyForecastListProps {
  daily: DailyForecast[];
}

const formatTemperature = (temperature: number): string =>
  `${Math.round(temperature)}°`;

const formatDay = (date: string): string =>
  new Intl.DateTimeFormat("en", {
    weekday: "long",
  }).format(new Date(`${date}T12:00:00`));

function DailyForecastList({ daily }: DailyForecastListProps) {
  return (
    <div className="mt-5 flex flex-col gap-3">
      {daily.map((forecast) => {
        const condition = getWeatherCondition(forecast.weatherCode);

        return (
          <article
            key={forecast.date}
            className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg bg-neutral-700 p-4 sm:grid-cols-[1fr_auto_auto]"
          >
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-neutral-0">
                {formatDay(forecast.date)}
              </h3>
              <p className="mt-1 text-sm font-medium text-neutral-300">
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
              <span className="text-neutral-300">
                {formatTemperature(forecast.temperatureMin)}
              </span>
              <span className="text-neutral-0">
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
