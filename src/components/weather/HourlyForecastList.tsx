import { useRef, useState, type PointerEvent } from "react";
import type { HourlyForecast } from "../../services/weatherService";
import { getWeatherCondition } from "./weatherConditions";

interface HourlyForecastListProps {
  hourly: HourlyForecast[];
  className?: string;
}

const formatTemperature = (temperature: number): string =>
  `${Math.round(temperature)}°`;

const formatHour = (time: string): string =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    hour12: true,
  }).format(new Date(time));

function HourlyForecastList({
  hourly,
  className = "",
}: HourlyForecastListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) {
      return;
    }

    setIsDragging(true);
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) {
      return;
    }

    event.preventDefault();
    scrollContainerRef.current.scrollLeft =
      dragStartScrollLeftRef.current - (event.clientX - dragStartXRef.current);
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);

    if (scrollContainerRef.current?.hasPointerCapture(event.pointerId)) {
      scrollContainerRef.current.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className={`scrollbar-clean -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 select-none sm:-mx-5 sm:gap-3 sm:px-5 ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
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
            className="flex min-w-20 flex-col items-center gap-1 rounded-lg bg-app-surface-muted px-2 py-3 text-center sm:min-w-24 sm:gap-1.5 sm:py-4"
          >
            <p className="text-xs font-semibold text-app-text-muted sm:text-sm">
              {formatHour(forecast.time)}
            </p>
            <img
              src={condition.icon}
              alt=""
              className="size-10 object-contain sm:size-12"
              aria-hidden="true"
            />
            <p className="text-xl font-bold text-app-text sm:text-2xl">
              {formatTemperature(forecast.temperature)}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export default HourlyForecastList;
