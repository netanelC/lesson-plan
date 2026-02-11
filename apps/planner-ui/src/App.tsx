import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './features/auth/context/AuthProvider';
import { LoginPage } from './features/auth/components/LoginPage';
import { RequireAuth } from './features/auth/components/RequireAuth';
import { Layout } from './components/Layout';
import { LessonPlanList } from './features/lesson-plans/components/LessonPlanList';
import { CreateLessonPlanForm } from './features/lesson-plans/components/CreateLessonPlanForm';
import { LessonPlanDetails } from './features/lesson-plans/components/LessonPlanDetails';
import { EditLessonPlan } from './features/lesson-plans/components/EditLessonPlan';
import { UserManagement } from './features/users/components/UserManagement';

const queryClient = new QueryClient();

// Accessing the variable safely via import.meta.env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  if (!GOOGLE_CLIENT_ID) {
    console.error("VITE_GOOGLE_CLIENT_ID is not defined in the environment variables.");
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* --- Public Routes (No Layout) --- */}
              <Route path="/login" element={<LoginPage />} />

              {/* --- Protected Routes (With Layout) --- */}
              <Route element={<RequireAuth />}>
                <Route path="/" element={<Layout><LessonPlanList /></Layout>} />
                <Route path="/create" element={<Layout><CreateLessonPlanForm /></Layout>} />
                <Route path="/plan/:id" element={<Layout><LessonPlanDetails /></Layout>} />
                <Route path="/plan/:id/edit" element={<Layout><EditLessonPlan /></Layout>} />
                <Route path="/users" element={<Layout><UserManagement /></Layout>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;