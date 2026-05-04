import type { HourlyForecast } from "../../services/weatherService";
import { getWeatherCondition } from "./weatherConditions";

interface HourlyForecastListProps {
  hourly: HourlyForecast[];
}

const formatTemperature = (temperature: number): string =>
  `${Math.round(temperature)}°`;

const formatHour = (time: string): string =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    hour12: true,
  }).format(new Date(time));

function HourlyForecastList({ hourly }: HourlyForecastListProps) {
  return (
    <div className="scrollbar-clean -mx-4 mt-5 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-5 sm:px-5">
      {hourly.map((forecast) => {
        const condition = getWeatherCondition(forecast.weatherCode);

        return (
          <article
            key={forecast.time}
            className="flex min-w-24 flex-col items-center gap-3 rounded-lg bg-neutral-700 px-4 py-4 text-center"
          >
            <p className="text-sm font-semibold text-neutral-200">
              {formatHour(forecast.time)}
            </p>
            <img
              src={condition.icon}
              alt=""
              className="size-12 object-contain"
              aria-hidden="true"
            />
            <p className="text-2xl font-bold text-neutral-0">
              {formatTemperature(forecast.temperature)}
            </p>
            <p className="text-xs font-medium text-neutral-300">
              {forecast.precipitationProbability}%
            </p>
          </article>
        );
      })}
    </div>
  );
}

export default HourlyForecastList;
