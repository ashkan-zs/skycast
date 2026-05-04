import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

interface TimeBasedThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const DARK_MODE_START_HOUR = 18;
const LIGHT_MODE_START_HOUR = 6;

const getThemeForDate = (date: Date): ThemeMode => {
  const hour = date.getHours();

  return hour >= DARK_MODE_START_HOUR || hour < LIGHT_MODE_START_HOUR
    ? "dark"
    : "light";
};

const getMillisecondsUntilNextThemeChange = (date: Date): number => {
  const nextChange = new Date(date);
  const nextHour =
    getThemeForDate(date) === "dark"
      ? LIGHT_MODE_START_HOUR
      : DARK_MODE_START_HOUR;

  nextChange.setHours(nextHour, 0, 0, 0);

  if (nextChange <= date) {
    nextChange.setDate(nextChange.getDate() + 1);
  }

  return nextChange.getTime() - date.getTime();
};

export const useTimeBasedTheme = (): TimeBasedThemeState => {
  const [theme, setTheme] = useState<ThemeMode>(() => getThemeForDate(new Date()));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    const timeoutId = window.setTimeout(() => {
      setTheme(getThemeForDate(new Date()));
    }, getMillisecondsUntilNextThemeChange(new Date()));

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
};
