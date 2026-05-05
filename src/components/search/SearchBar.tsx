import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import searchIcon from "../../assets/images/icon-search.svg";
import {
  fetchLocation,
  type LocationResult,
} from "../../services/weatherService";

interface SearchBarProps {
  onLocationSelect?: (location: LocationResult) => void;
  placeholder?: string;
  className?: string;
}

function SearchBar({
  onLocationSelect,
  placeholder = "Search for a city",
  className = "",
}: SearchBarProps) {
  const inputId = useId();
  const searchContainerRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const normalizedQuery = query.trim();
  const shouldShowSuggestions =
    isFocused && (suggestions.length > 0 || isLoading || errorMessage !== "");

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      return;
    }

    let isCurrentRequest = true;

    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const locations = await fetchLocation(normalizedQuery);

        if (isCurrentRequest) {
          setSuggestions(locations);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setSuggestions([]);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to find matching cities.",
          );
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      isCurrentRequest = false;
      window.clearTimeout(timeoutId);
    };
  }, [normalizedQuery]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!searchContainerRef.current?.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const formatLocationName = (location: LocationResult): string =>
    [location.name, location.admin1, location.country].filter(Boolean).join(", ");

  const handleLocationSelect = (location: LocationResult) => {
    setQuery(formatLocationName(location));
    setSuggestions([]);
    setIsFocused(false);
    onLocationSelect?.(location);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = event.target.value;

    setQuery(nextQuery);

    if (nextQuery.trim().length < 2) {
      setSuggestions([]);
      setErrorMessage("");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (normalizedQuery.length < 2) {
      return;
    }

    if (suggestions[0]) {
      handleLocationSelect(suggestions[0]);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const locations = await fetchLocation(normalizedQuery);

      if (locations[0]) {
        handleLocationSelect(locations[0]);
      } else {
        setSuggestions([]);
        setErrorMessage("No matching cities found.");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to search for cities.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      ref={searchContainerRef}
      className={`relative w-full ${className}`}
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor={inputId}>
        Search for a city
      </label>
      <div className="flex min-h-14 w-full items-center gap-2 rounded-lg border border-app-border bg-app-surface p-2 shadow-[0_18px_45px_rgba(0,0,0,0.16)] focus-within:border-blue-500 sm:min-h-16 sm:gap-3 sm:p-3">
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-2 text-base font-medium text-app-text outline-none placeholder:text-app-text-muted sm:px-3"
          onChange={handleQueryChange}
          onFocus={() => setIsFocused(true)}
        />
        <button
          type="submit"
          disabled={normalizedQuery.length < 2 || isLoading}
          className="grid size-9 shrink-0 place-items-center rounded-md bg-blue-500 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-app-surface disabled:cursor-not-allowed disabled:bg-app-border sm:size-10"
          aria-label="Search city"
        >
          <img src={searchIcon} alt="" className="size-4" aria-hidden="true" />
        </button>
      </div>

      {shouldShowSuggestions ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-lg border border-app-border bg-app-surface shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
          {isLoading ? (
            <p className="px-3 py-2.5 text-sm font-medium text-app-text-muted sm:px-4 sm:py-3">
              Searching...
            </p>
          ) : null}

          {!isLoading && errorMessage !== "" ? (
            <p className="px-3 py-2.5 text-sm font-medium text-app-text-muted sm:px-4 sm:py-3">
              {errorMessage}
            </p>
          ) : null}

          {!isLoading && suggestions.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto py-1.5 sm:max-h-72 sm:py-2">
              {suggestions.map((location) => (
                <li key={location.id}>
                  <button
                    type="button"
                    className="flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left transition hover:bg-app-surface-muted focus:bg-app-surface-muted focus:outline-none sm:gap-1 sm:px-4 sm:py-3"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <span className="text-sm font-semibold text-app-text sm:text-base">
                      {location.name}
                    </span>
                    <span className="text-xs font-medium text-app-text-muted sm:text-sm">
                      {[location.admin1, location.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

export default SearchBar;
