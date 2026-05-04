import drizzleIcon from "../../assets/images/icon-drizzle.webp";
import fogIcon from "../../assets/images/icon-fog.webp";
import overcastIcon from "../../assets/images/icon-overcast.webp";
import partlyCloudyIcon from "../../assets/images/icon-partly-cloudy.webp";
import rainIcon from "../../assets/images/icon-rain.webp";
import snowIcon from "../../assets/images/icon-snow.webp";
import stormIcon from "../../assets/images/icon-storm.webp";
import sunnyIcon from "../../assets/images/icon-sunny.webp";

export interface WeatherCondition {
  description: string;
  icon: string;
}

export const getWeatherCondition = (weatherCode: number): WeatherCondition => {
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
