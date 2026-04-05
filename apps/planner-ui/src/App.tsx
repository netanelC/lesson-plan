import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CreateLessonPlanForm } from "./features/lessonPlan/components/CreateLessonPlanForm";
import { LessonPlanList } from "./features/lessonPlan/components/LessonPlanList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
  path="/" 
  element={<Layout><LessonPlanList /></Layout>} 
/>
        <Route 
          path="/create" 
          element={<Layout><CreateLessonPlanForm /></Layout>} 
        />
        <Route 
          path="/plan/:id" 
          element={<Layout><div className="text-center py-20 font-bold text-gray-500">פרטי מערך (בבנייה...)</div></Layout>} 
        />
        <Route 
          path="/plan/:id/edit" 
          element={<Layout><div className="text-center py-20 font-bold text-gray-500">עריכת מערך (בבנייה...)</div></Layout>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
