import { createContext, useContext } from "react";
import type { ThemeMode } from "../../hooks/useTimeBasedTheme";

export interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return themeContext;
};
