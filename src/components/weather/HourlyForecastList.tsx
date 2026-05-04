import { useRef, useState } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) {
      return;
    }

    setIsDragging(true);
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) {
      return;
    }

    event.preventDefault();
    scrollContainerRef.current.scrollLeft =
      dragStartScrollLeftRef.current - (event.clientX - dragStartXRef.current);
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);

    if (scrollContainerRef.current?.hasPointerCapture(event.pointerId)) {
      scrollContainerRef.current.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className={`scrollbar-clean -mx-4 mt-5 flex gap-3 overflow-x-auto px-4 pb-2 select-none sm:-mx-5 sm:px-5 ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerLeave={stopDragging}
    >
      {hourly.map((forecast) => {
        const condition = getWeatherCondition(forecast.weatherCode);

        return (
          <article
            key={forecast.time}
            className="flex min-w-24 flex-col items-center gap-3 rounded-lg bg-app-surface-muted px-4 py-4 text-center"
          >
            <p className="text-sm font-semibold text-app-text-muted">
              {formatHour(forecast.time)}
            </p>
            <img
              src={condition.icon}
              alt=""
              className="size-12 object-contain"
              aria-hidden="true"
            />
            <p className="text-2xl font-bold text-app-text">
              {formatTemperature(forecast.temperature)}
            </p>
            <p className="text-xs font-medium text-app-text-muted">
              {forecast.precipitationProbability}%
            </p>
          </article>
        );
      })}
    </div>
  );
}

export default HourlyForecastList;
