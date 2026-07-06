import { useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { type LessonFilters, AGE_LABELS } from "@repo/types";
import { useAuth } from "../../auth/context/AuthContext";
import { useSavedPlans } from "../api/useSavedPlans";
import { useDeleteLessonPlan } from "../api/useDeleteLessonPlan";
import { extractApiError } from "../../../lib/axios";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { FilterBar } from "./FilterBar";
import { BookmarkButton } from "./BookmarkButton";

const HighlightText = ({
  text,
  highlight,
}: {
  text?: string;
  highlight?: string;
}) => {
  if (text == null) return null;
  if (highlight == null || highlight.trim() === "") return <>{text}</>;

  const escapeRegExp = (string: string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedHighlight = escapeRegExp(highlight.trim());
  const regex = new RegExp(`(${escapedHighlight})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200 text-gray-900 rounded-[2px] font-inherit"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

export const SavedPlansList = () => {
  const { user } = useAuth();
  const listTopRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<LessonFilters>({
    page: 1,
    limit: 12,
    search: undefined,
    ageGroup: undefined,
    frame: undefined,
  });

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
  } = useSavedPlans(filters);
  const deleteMutation = useDeleteLessonPlan();
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  const isFirstLoad = isLoading;
  const isBackgroundLoading = isFetching && !!response;

  const handleFilterChange = useCallback(
    (newFilters: Partial<LessonFilters>) => {
      setFilters((prev) => {
        const nextFilters = {
          ...prev,
          ...newFilters,
          page: 1,
        } as LessonFilters;
        if (JSON.stringify(prev) === JSON.stringify(nextFilters)) return prev;
        return nextFilters;
      });
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 12,
      search: undefined,
      ageGroup: undefined,
      frame: undefined,
    });
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (response?.meta && newPage > response.meta.totalPages))
      return;
    setFilters((prev) => ({ ...prev, page: newPage }));
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange({ limit: Number(e.target.value) });
  };

  const canDelete = (planAuthorId: string) => {
    if (user.role === "OWNER") return true;
    if (user.role === "ADMIN" && user.id === planAuthorId) return true;
    return false;
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setPlanToDelete(id);
  };

  const confirmDelete = async () => {
    if (planToDelete === null) return;
    try {
      await deleteMutation.mutateAsync(planToDelete);
      toast.success("המערך נמחק בהצלחה!");
    } catch (error) {
      toast.error(extractApiError(error) || "שגיאה במחיקת המערך");
    } finally {
      setPlanToDelete(null);
    }
  };

  const renderContent = () => {
    if (isFirstLoad) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center p-10 bg-red-50 text-red-600 rounded-lg border border-red-100">
          <p className="font-bold">שגיאה בטעינת המערכים.</p>
          <p className="text-sm">יש לוודא שהשרת רץ ושהחיבור תקין.</p>
        </div>
      );
    }

    if (!response?.data || response.data.length === 0) {
      return (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">אין מערכים שמורים</h3>
          <p className="mt-2 text-sm text-gray-500">
            עדיין לא שמרת אף מערך שיעור. ניתן לשמור מערכים מתוך ספריית המערכים.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            חזרה לספרייה
          </Link>
        </div>
      );
    }

    return (
      <div className="relative transition-opacity duration-200">
        {isBackgroundLoading && (
          <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {response.data.map((plan) => (
            <div
              key={plan.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {canDelete(plan.authorId) && (
                <button
                  onClick={(e) => handleDeleteClick(e, plan.id)}
                  disabled={deleteMutation.isPending}
                  className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm border border-transparent hover:border-red-100 z-10"
                  title="מחיקת מערך"
                >
                  {deleteMutation.isPending ? (
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              )}

              {/* Bookmark Button */}
              <div className={`absolute top-4 ${canDelete(plan.authorId) ? 'left-14' : 'left-4'} z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity`}>
                <BookmarkButton
                  lessonPlanId={plan.id}
                  initialIsSaved={
                    Array.isArray(plan.savedBy) &&
                    plan.savedBy.some((s) => s.userId === user.id)
                  }
                  className="bg-white/90 shadow-sm border border-transparent hover:border-red-100"
                />
              </div>

              <div className="p-6 flex-1 pt-12">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                  <HighlightText text={plan.topic} highlight={filters.search} />
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                  <HighlightText
                    text={plan.superGoal}
                    highlight={filters.search}
                  />
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    גיל: {AGE_LABELS[plan.ageGroup]}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                    <HighlightText
                      text={plan.unit}
                      highlight={filters.search}
                    />
                  </span>
                  <span
                    className="inline-flex items-center text-xs text-gray-400 mr-auto"
                    dir="ltr"
                  >
                    {new Date(plan.createdAt).toLocaleDateString("he-IL")}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50/50 px-4 py-3 border-t border-gray-100 flex justify-between items-center group-hover:bg-indigo-50/30 transition-colors">
                <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1 shrink-0">
                  <svg
                    className="h-3.5 w-3.5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {Array.isArray(plan.lessonFlow) ? plan.lessonFlow.length : 0} שלבים
                  {(() => {
                    const duration = (plan.lessonFlow as import("@repo/types").LessonFlowStep[]).reduce((sum, step) => sum + (step.durationMinutes || 0), 0);
                    return duration > 0 ? ` (${duration} דק')` : "";
                  })()}
                </span>

                <div className="flex items-center gap-1.5 px-2 overflow-hidden">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 shrink-0 border border-indigo-200">
                    {plan.author.fullName.length > 0
                      ? plan.author.fullName.charAt(0)
                      : "U"}
                  </div>
                  <span className="text-[11px] text-gray-600 truncate font-medium">
                    {plan.author.fullName.length > 0
                      ? plan.author.fullName
                      : "משתמש"}
                  </span>
                </div>

                <Link
                  to={`/plan/${plan.id}`}
                  className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  צפייה בפרטים
                  <svg
                    className="h-3.5 w-3.5 rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {response.meta.totalPages > 0 && (
          <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-12 py-6 border-t border-gray-100 gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span>תצוגה:</span>
              <select
                value={filters.limit}
                onChange={handleLimitChange}
                className="cursor-pointer rounded-md border-indigo-200 bg-indigo-50 py-1.5 pl-8 pr-3 text-sm font-bold text-indigo-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 hover:bg-indigo-100 transition-colors shadow-sm"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
              <span>פריטים לעמוד</span>
            </div>

            {response.meta.totalPages > 1 && (
              <div className="flex flex-col items-center">
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white"
                  aria-label="Pagination"
                  dir="rtl"
                >
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center rounded-r-md px-3 py-2 text-indigo-600 ring-1 ring-inset ring-gray-300 hover:bg-indigo-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="mr-1 text-sm font-bold">הקודם</span>
                  </button>

                  {Array.from(
                    { length: response.meta.totalPages },
                    (_, i) => i + 1,
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-bold ring-1 ring-inset focus:z-20 focus:outline-offset-0 transition-colors ${
                        filters.page === pageNum
                          ? "z-10 bg-indigo-600 text-white ring-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "text-indigo-600 ring-gray-300 hover:bg-indigo-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === response.meta.totalPages}
                    className="relative inline-flex items-center rounded-l-md px-3 py-2 text-indigo-600 ring-1 ring-inset ring-gray-300 hover:bg-indigo-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="ml-1 text-sm font-bold">הבא</span>
                  </button>
                </nav>
                <div className="mt-2 text-xs text-gray-500">
                  עמוד {filters.page} מתוך {response.meta.totalPages}
                </div>
              </div>
            )}

            <div className="hidden md:block w-32"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8" dir="rtl" ref={listTopRef}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 text-red-500 rounded-full">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              המועדפים שלי
            </h1>
            <p className="text-gray-500 mt-1">הספרייה האישית שלך</p>
          </div>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {renderContent()}

      <ConfirmModal
        isOpen={planToDelete !== null}
        onClose={() => setPlanToDelete(null)}
        onConfirm={confirmDelete}
        title="מחיקת מערך"
        message="האם למחוק מערך זה? (פעולה זו לא ניתנת לביטול)"
        confirmText="מחיקת מערך"
        isDestructive={true}
      />
    </div>
  );
};
