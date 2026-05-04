import type { SavedLocation } from "../../types/location";

interface SavedLocationsProps {
  locations: SavedLocation[];
  activeLocationId?: string;
  onLocationSelect: (location: SavedLocation) => void;
  onLocationRemove: (locationId: string) => void;
}

function SavedLocations({
  locations,
  activeLocationId,
  onLocationSelect,
  onLocationRemove,
}: SavedLocationsProps) {
  if (locations.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-app-border bg-app-surface p-4 shadow-[0_18px_45px_rgba(0,0,0,0.14)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-app-text">
          Saved locations
        </h2>
      </div>

      <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {locations.map((location) => {
          const isActive = activeLocationId === location.id;

          return (
            <li
              key={location.id}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                isActive
                  ? "border-blue-500 bg-app-surface-muted"
                  : "border-app-border bg-app-surface-muted/60"
              }`}
            >
              <button
                type="button"
                className="min-w-0 text-left focus:outline-none focus:ring-2 focus:ring-orange-500"
                onClick={() => onLocationSelect(location)}
              >
                <span className="block truncate text-sm font-bold text-app-text">
                  {location.name}
                </span>
                <span className="block truncate text-xs font-medium text-app-text-muted">
                  {[location.admin1, location.country].filter(Boolean).join(", ")}
                </span>
              </button>

              <button
                type="button"
                className="shrink-0 rounded-md px-3 py-2 text-xs font-bold text-app-text-muted transition hover:bg-app-border hover:text-app-text focus:outline-none focus:ring-2 focus:ring-orange-500"
                onClick={() => onLocationRemove(location.id)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default SavedLocations;
