import { useState } from "react";
import type {
  DailyForecast,
  HourlyForecast,
} from "../../services/weatherService";
import DailyForecastList from "./DailyForecastList";
import HourlyForecastList from "./HourlyForecastList";

type ForecastView = "daily" | "hourly";

interface ForecastProps {
  daily: DailyForecast[];
  hourly: HourlyForecast[];
}

interface ForecastTab {
  label: string;
  value: ForecastView;
}

const forecastTabs: ForecastTab[] = [
  { label: "Daily", value: "daily" },
  { label: "Hourly", value: "hourly" },
];

function Forecast({ daily, hourly }: ForecastProps) {
  const [activeView, setActiveView] = useState<ForecastView>("daily");

  return (
    <section className="rounded-lg border border-app-border bg-app-surface p-4 shadow-[0_24px_60px_rgba(0,0,0,0.16)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl font-bold text-app-text">
          Forecast
        </h2>

        <div
          className="grid grid-cols-2 rounded-lg bg-app-surface-muted p-1"
          role="tablist"
          aria-label="Forecast view"
        >
          {forecastTabs.map((tab) => {
            const isActive = activeView === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`rounded-md px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isActive
                    ? "bg-blue-500 text-neutral-0"
                    : "text-app-text-muted hover:bg-app-border hover:text-app-text"
                }`}
                onClick={() => setActiveView(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeView === "hourly" ? (
        <HourlyForecastList hourly={hourly} />
      ) : (
        <DailyForecastList daily={daily} />
      )}
    </section>
  );
}

export default Forecast;
