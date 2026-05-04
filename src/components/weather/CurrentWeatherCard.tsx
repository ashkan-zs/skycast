import drizzleIcon from "../../assets/images/icon-drizzle.webp";
import fogIcon from "../../assets/images/icon-fog.webp";
import overcastIcon from "../../assets/images/icon-overcast.webp";
import partlyCloudyIcon from "../../assets/images/icon-partly-cloudy.webp";
import rainIcon from "../../assets/images/icon-rain.webp";
import snowIcon from "../../assets/images/icon-snow.webp";
import stormIcon from "../../assets/images/icon-storm.webp";
import sunnyIcon from "../../assets/images/icon-sunny.webp";
import type { CurrentWeather } from "../../services/weatherService";

interface CurrentWeatherCardProps {
  cityName: string;
  weather: CurrentWeather;
}

interface WeatherCondition {
  description: string;
  icon: string;
}

interface WeatherMetric {
  label: string;
  value: string;
}

const getWeatherCondition = (weatherCode: number): WeatherCondition => {
  if (weatherCode === 0) {
    return { description: "Sunny", icon: sunnyIcon };
  }

  if ([1, 2].includes(weatherCode)) {
    return { description: "Partly cloudy", icon: partlyCloudyIcon };
  }

  if (weatherCode === 3) {
    return { description: "Overcast", icon: overcastIcon };
  }

  if ([45, 48].includes(weatherCode)) {
    return { description: "Fog", icon: fogIcon };
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return { description: "Drizzle", icon: drizzleIcon };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return { description: "Rain", icon: rainIcon };
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return { description: "Snow", icon: snowIcon };
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return { description: "Storm", icon: stormIcon };
  }

  return { description: "Cloudy", icon: partlyCloudyIcon };
};

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
