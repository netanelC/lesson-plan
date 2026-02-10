import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LessonPlanList } from './features/lesson-plans/components/LessonPlanList';
import { CreateLessonPlanForm } from './features/lesson-plans/components/CreateLessonPlanForm';
import { LessonPlanDetails } from './features/lesson-plans/components/LessonPlanDetails';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LessonPlanList />} />
          <Route path="/create" element={<CreateLessonPlanForm />} />
          <Route path="/plan/:id" element={<LessonPlanDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;