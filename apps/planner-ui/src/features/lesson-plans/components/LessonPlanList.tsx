import { Link } from 'react-router-dom';
import { useLessonPlans } from '../api/useLessonPlans';
import { useDeleteLessonPlan } from '../api/useDeleteLessonPlan'; // <--- Import

export const LessonPlanList = () => {
  const { data: plans, isLoading, isError } = useLessonPlans();
  const deleteMutation = useDeleteLessonPlan(); // <--- Hook

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent clicking the card link
    if (window.confirm('האם אתה בטוח שברצונך למחוק מערך זה?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-10 bg-red-50 text-red-600 rounded-lg">
        שגיאה בטעינת המערכים. וודא שהשרת רץ.
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">אין עדיין מערכי שיעור</h3>
        <p className="mt-1 text-sm text-gray-500">צור את המערך הראשון שלך כדי להתחיל.</p>
        <div className="mt-6">
          <Link
            to="/create"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            צור מערך חדש
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
           <h1 className="text-3xl font-extrabold text-gray-900">המערכים שלי</h1>
           <p className="text-gray-500 mt-1">נהל את כל מערכי השיעור שלך במקום אחד</p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          צור חדש
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Delete Button (Absolute Position) */}
            <button
              onClick={(e) => handleDelete(e, plan.id)}
              disabled={deleteMutation.isPending}
              className="absolute top-4 left-4 p-2 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm border border-transparent hover:border-red-100 z-10"
              title="מחק מערך"
            >
              {deleteMutation.isPending ? (
                 <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              ) : (
                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                 </svg>
              )}
            </button>

            <div className="p-6 flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                {plan.topic}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {plan.superGoal}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                  גיל: {plan.ageGroup}
                </span>
                <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                  {plan.unit}
                </span>
                <span className="inline-flex items-center text-xs text-gray-400 mr-auto">
                   {new Date(plan.createdAt).toLocaleDateString('he-IL')}
                </span>
              </div>
            </div>

            <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-100 flex justify-between items-center group-hover:bg-indigo-50/30 transition-colors">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {plan.lessonFlow.length} שלבים
              </span>
              
              <Link 
                to={`/plan/${plan.id}`}
                className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
              >
                צפה בפרטים
                <svg className="h-4 w-4 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};