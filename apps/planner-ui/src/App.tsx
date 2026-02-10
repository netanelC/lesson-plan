import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LessonPlanList } from './features/lesson-plans/components/LessonPlanList';
import { CreateLessonPlanForm } from './features/lesson-plans/components/CreateLessonPlanForm';
import { LessonPlanDetails } from './features/lesson-plans/components/LessonPlanDetails';
import { EditLessonPlan } from './features/lesson-plans/components/EditLessonPlan';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LessonPlanList />} />
          <Route path="/create" element={<CreateLessonPlanForm />} />
          <Route path="/plan/:id" element={<LessonPlanDetails />} />
          <Route path="/plan/:id/edit" element={<EditLessonPlan />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;