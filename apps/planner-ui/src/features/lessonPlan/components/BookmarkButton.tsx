import { useState } from "react";
import { toast } from "react-hot-toast";
import { useToggleBookmark } from "../api/useToggleBookmark";

interface BookmarkButtonProps {
  lessonPlanId: string;
  initialIsSaved: boolean;
  className?: string;
}

export const BookmarkButton = ({ lessonPlanId, initialIsSaved, className = "" }: BookmarkButtonProps) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const toggleMutation = useToggleBookmark();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    const prevSaved = isSaved;
    setIsSaved(!prevSaved);

    toggleMutation.mutate(lessonPlanId, {
      onError: () => {
        // Revert on error
        setIsSaved(prevSaved);
        toast.error("שגיאה בשמירת המערך");
      },
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        isSaved
          ? "text-red-500 bg-red-50 hover:bg-red-100"
          : "text-gray-400 bg-gray-50 hover:text-red-500 hover:bg-red-50"
      } ${className}`}
      title={isSaved ? "הסר מהשמורים" : "שמור מערך"}
    >
      <svg
        className={`w-5 h-5 transition-transform ${isSaved ? "scale-110 fill-current" : "fill-none"}`}
        stroke="currentColor"
        viewBox="0 0 24 24"
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        strokeWidth={isSaved ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};
