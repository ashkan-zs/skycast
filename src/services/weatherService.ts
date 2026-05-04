const FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  isDay: boolean;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
  countryCode?: string;
  admin1?: string;
  population?: number;
}

interface OpenMeteoCurrentResponse {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  is_day: number;
}

interface OpenMeteoHourlyResponse {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  wind_speed_10m: number[];
}

interface OpenMeteoDailyResponse {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  precipitation_probability_max: number[];
  precipitation_sum: number[];
  sunrise: string[];
  sunset: string[];
}

interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: OpenMeteoCurrentResponse;
  hourly: OpenMeteoHourlyResponse;
  daily: OpenMeteoDailyResponse;
}

interface OpenMeteoGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  population?: number;
}

interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[];
}

interface OpenMeteoErrorResponse {
  error?: boolean;
  reason?: string;
}

const getErrorMessage = (fallback: string, data: unknown): string => {
  const errorData = data as OpenMeteoErrorResponse;

  return errorData.reason ?? fallback;
};

const fetchJson = async <T>(url: string, fallbackError: string): Promise<T> => {
  const response = await fetch(url);
  const data = (await response.json()) as unknown;

  if (!response.ok) {
    throw new Error(getErrorMessage(fallbackError, data));
  }

  return data as T;
};

const buildForecastUrl = (lat: number, lon: number): string => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "is_day",
    ].join(","),
    hourly: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation_probability",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "precipitation_probability_max",
      "precipitation_sum",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "auto",
    forecast_days: "7",
  });

  return `${FORECAST_API_URL}?${params.toString()}`;
};

const transformForecastResponse = (
  data: OpenMeteoForecastResponse,
): WeatherData => ({
  latitude: data.latitude,
  longitude: data.longitude,
  timezone: data.timezone,
  current: {
    time: data.current.time,
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    isDay: data.current.is_day === 1,
  },
  hourly: data.hourly.time.slice(0, 24).map((time, index) => ({
    time,
    temperature: data.hourly.temperature_2m[index],
    apparentTemperature: data.hourly.apparent_temperature[index],
    humidity: data.hourly.relative_humidity_2m[index],
    precipitationProbability: data.hourly.precipitation_probability[index],
    precipitation: data.hourly.precipitation[index],
    weatherCode: data.hourly.weather_code[index],
    windSpeed: data.hourly.wind_speed_10m[index],
  })),
  daily: data.daily.time.slice(0, 7).map((date, index) => ({
    date,
    weatherCode: data.daily.weather_code[index],
    temperatureMax: data.daily.temperature_2m_max[index],
    temperatureMin: data.daily.temperature_2m_min[index],
    apparentTemperatureMax: data.daily.apparent_temperature_max[index],
    apparentTemperatureMin: data.daily.apparent_temperature_min[index],
    precipitationProbabilityMax:
      data.daily.precipitation_probability_max[index],
    precipitationSum: data.daily.precipitation_sum[index],
    sunrise: data.daily.sunrise[index],
    sunset: data.daily.sunset[index],
  })),
});

const transformLocationResult = (
  location: OpenMeteoGeocodingResult,
): LocationResult => ({
  id: location.id,
  name: location.name,
  latitude: location.latitude,
  longitude: location.longitude,
  timezone: location.timezone,
  country: location.country,
  countryCode: location.country_code,
  admin1: location.admin1,
  population: location.population,
});

export const fetchWeather = async (
  lat: number,
  lon: number,
): Promise<WeatherData> => {
  const url = buildForecastUrl(lat, lon);
  const data = await fetchJson<OpenMeteoForecastResponse>(
    url,
    "Unable to fetch weather data.",
  );

  return transformForecastResponse(data);
};

export const fetchLocation = async (
  query: string,
): Promise<LocationResult[]> => {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    name: normalizedQuery,
    count: "10",
    language: "en",
    format: "json",
  });

  const data = await fetchJson<OpenMeteoGeocodingResponse>(
    `${GEOCODING_API_URL}?${params.toString()}`,
    "Unable to fetch location data.",
  );

  return data.results?.map(transformLocationResult) ?? [];
};
