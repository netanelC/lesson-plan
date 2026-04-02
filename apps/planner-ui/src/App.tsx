import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CreateLessonPlanForm } from "./features/lessonPlan/components/CreateLessonPlanForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* We wrap everything in our Layout, but use placeholders for the routes we haven't rebuilt yet */}
        <Route 
          path="/" 
          element={<Layout><div className="text-center py-20 font-bold text-gray-500">ספריית המערכים (בבנייה...)</div></Layout>} 
        />
        
        {/* This is our newly wired Create form! */}
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
