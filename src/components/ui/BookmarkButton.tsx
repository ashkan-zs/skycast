interface BookmarkButtonProps {
  isSaved: boolean;
  onClick?: () => void;
  className?: string;
}

function BookmarkButton({
  isSaved,
  onClick,
  className = "",
}: BookmarkButtonProps) {
  return (
    <button
      type="button"
      className={`grid size-11 place-items-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-orange-500 ${
        isSaved ? "text-orange-500" : "text-neutral-0 hover:text-neutral-200"
      } ${className}`}
      onClick={onClick}
      aria-label={isSaved ? "Remove saved location" : "Save current location"}
      title={isSaved ? "Remove saved location" : "Save location"}
    >
      <svg
        className="size-5"
        viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        aria-hidden="true"
      >
        <path
          d="M6 4.75C6 3.784 6.784 3 7.75 3h8.5C17.216 3 18 3.784 18 4.75v16L12 17l-6 3.75v-16Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </button>
  );
}

export default BookmarkButton;
