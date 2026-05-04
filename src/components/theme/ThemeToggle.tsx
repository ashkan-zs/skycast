import { useTheme } from "./themeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="grid size-11 place-items-center rounded-md border border-app-border bg-app-surface text-app-text shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition hover:bg-app-surface-muted focus:outline-none focus:ring-2 focus:ring-orange-500"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 4v2.5M12 17.5V20M4 12h2.5M17.5 12H20M6.34 6.34l1.77 1.77M15.89 15.89l1.77 1.77M17.66 6.34l-1.77 1.77M8.11 15.89l-1.77 1.77"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      ) : (
        <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M18.5 14.15A6.72 6.72 0 0 1 9.85 5.5 7.25 7.25 0 1 0 18.5 14.15Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
