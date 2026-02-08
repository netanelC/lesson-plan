import { CreateLessonPlanForm } from './features/lesson-plans';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        מתכנן מערכי שיעור
      </h1>
      <CreateLessonPlanForm />
    </div>
  );
}

export default App