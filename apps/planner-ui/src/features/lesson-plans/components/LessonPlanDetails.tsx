import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useLessonPlan } from '../api/useLessonPlan';
import { SectionCard } from '../../../components/ui/SectionCard';
import { exportLessonPlanToWord } from '../../../utils/exportToWord'; // <--- Import helper

export const LessonPlanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: plan, isLoading, isError } = useLessonPlan(id || '');
  
  // Ref for PDF Printing
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: plan ? `מערך שיעור - ${plan.topic}` : 'Lesson Plan',
  });

  if (isLoading) return <div className="text-center py-20">טוען מערך שיעור...</div>;
  if (isError || !plan) return <div className="text-center py-20 text-red-600">שגיאה בטעינת המערך</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
      
      {/* --- Action Bar (Hidden when printing) --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
          <Link to="/" className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 self-start sm:self-auto">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            חזרה לרשימה
          </Link>

          <div className="flex gap-3 self-end sm:self-auto">
            {/* Word Export Button */}
            <button 
              onClick={() => exportLessonPlanToWord(plan)}
              className="flex items-center gap-2 text-blue-700 bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              ייצא ל- Word
            </button>

            {/* Print/PDF Button */}
            <button 
              onClick={() => handlePrint()}
              className="flex items-center gap-2 text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              ייצא ל- PDF
            </button>

            {/* Add this Edit Button */}
            <Link
              to={`/plan/${plan.id}/edit`}
              className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors font-medium text-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              ערוך מערך
            </Link>
          </div>
      </div>

      {/* --- Main Content (Printable Area) --- */}
      <div ref={componentRef} className="print:p-0 print:mx-0">
        
        {/* Header Card */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:border-none print:shadow-none print:p-0 print:mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{plan.topic}</h1>
            <p className="text-lg text-indigo-600 font-medium mt-1">{plan.superGoal}</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100">
              גיל {plan.ageGroup}
            </span>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-bold border border-purple-100">
              {plan.unit}
            </span>
          </div>
          {/* Print-only metadata display */}
          <div className="hidden print:block text-sm text-gray-500">
             גיל: {plan.ageGroup} | יחידה: {plan.unit} | תאריך: {new Date(plan.createdAt).toLocaleDateString('he-IL')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block print:space-y-6">
          
          {/* --- Right Column: Main Content (Wide) --- */}
          <div className="lg:col-span-2 space-y-8 print:space-y-6">
            
            {/* 1. Operative Goals */}
            <SectionCard 
              title="מטרות אופרטיביות" 
              theme="orange" 
              icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            >
               <ul className="grid grid-cols-1 gap-3">
                 {plan.operativeGoals.map((goal, i) => (
                   <li key={i} className="flex gap-3 items-start bg-orange-50/50 p-3 rounded-lg border border-orange-100 text-gray-800 print:bg-transparent print:border-0 print:p-0 print:mb-2">
                     <span className="text-orange-500 font-bold mt-0.5">•</span>
                     <span>{goal}</span>
                   </li>
                 ))}
               </ul>
            </SectionCard>

            {/* 2. Timeline (Lesson Flow) */}
            <SectionCard 
              title="מהלך השיעור" 
              theme="green" 
              icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            >
              <div className="relative border-r-2 border-green-100 mr-3 space-y-8 pr-6 print:border-none print:mr-0 print:pr-0 print:space-y-4">
                {plan.lessonFlow.map((step, idx) => (
                  <div key={idx} className="relative print:border-b print:border-gray-100 print:pb-4">
                    {/* Dot hidden in print usually, or styled differently */}
                    <div className="absolute -right-[33px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-green-100 print:hidden"></div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{step.name}</h3>
                      {step.durationMinutes && (
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-600 print:border print:border-gray-200">
                          {step.durationMinutes} דק׳
                        </span>
                      )}
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-gray-700 whitespace-pre-line leading-relaxed print:border-none print:shadow-none print:p-0">
                      {step.description}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* --- Left Column: Sidebar (Narrow) --- */}
          <div className="space-y-6 print:space-y-6 print:mt-6">
             {/* 1. Metadata Card */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:border print:border-gray-300 print:p-4 print:shadow-none">
                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">פרטים נוספים</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">מסגרת הוראה</dt>
                    <dd className="font-medium text-gray-900">{plan.frame === 'plenary' ? 'מליאה' : 'קבוצה קטנה'}</dd>
                  </div>
                  {plan.priorKnowledge && (
                    <div>
                      <dt className="text-sm text-gray-500">ידע קודם נדרש</dt>
                      <dd className="font-medium text-gray-900">{plan.priorKnowledge}</dd>
                    </div>
                  )}
                  <div className="print:hidden">
                    <dt className="text-sm text-gray-500">תאריך יצירה</dt>
                    <dd className="font-medium text-gray-900">{new Date(plan.createdAt).toLocaleDateString('he-IL')}</dd>
                  </div>
                </dl>
             </div>

             {/* 2. Teaching Aids */}
             {plan.teachingAids.length > 0 && (
               <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 print:bg-white print:border print:border-gray-300 print:p-4">
                 <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2 print:text-gray-900">
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                   ציוד נדרש
                 </h3>
                 <ul className="list-disc list-inside text-indigo-800 space-y-1 print:text-gray-800">
                   {plan.teachingAids.map((aid, i) => <li key={i}>{aid}</li>)}
                 </ul>
               </div>
             )}

             {/* 3. Attachments - HIDDEN IN PRINT */}
             {plan.attachments && plan.attachments.length > 0 && (
              <div className="print:hidden">
                <SectionCard 
                  title="קבצים ומדיה" 
                  theme="indigo" 
                  icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>}
                >
                  <div className="grid grid-cols-1 gap-3">
                    {plan.attachments.map((file) => (
                      <div key={file.id} className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3 shadow-sm">
                        <div className="flex-1 overflow-hidden">
                          <p className="font-semibold text-gray-800 text-sm truncate mb-0.5" title={file.filename}>{file.filename}</p>
                          {file.fileType.startsWith('audio/') ? (
                            <audio controls className="w-full h-8 mt-1.5" src={file.url}>
                              הדפדפן שלך לא תומך בניגון אודיו.
                            </audio>
                          ) : (
                            <p className="text-[10px] text-gray-500 uppercase">{file.fileType.split('/')[1]} FILE</p>
                          )}
                        </div>
                        <a 
                          href={`/api/lessons/attachments/${file.id}/download`} 
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors shrink-0"
                          title="הורד קובץ"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}

             {/* 4. References */}
             {plan.references.length > 0 && (
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:border print:border-gray-300 print:shadow-none print:p-4">
                 <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                   <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                   מקורות מידע
                 </h3>
                 <ul className="space-y-2">
                   {plan.references.map((ref, i) => (
                      <li key={i}>
                        {ref.startsWith('http') ? (
                          <a href={ref} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-sm break-all print:text-gray-900 print:no-underline">{ref}</a>
                        ) : (
                          <span className="text-gray-700 text-sm">{ref}</span>
                        )}
                      </li>
                   ))}
                 </ul>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};