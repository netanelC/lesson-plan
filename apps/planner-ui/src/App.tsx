import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import { LoginPage } from "./features/auth/components/LoginPage";
import { RegisterPage } from "./features/auth/components/RegisterPage";
import { RequireAuth } from "./features/auth/components/RequireAuth";
import { Layout } from "./components/Layout";
import { LessonPlanList } from "./features/lessonPlan/components/LessonPlanList";
import { CreateLessonPlanForm } from "./features/lessonPlan/components/CreateLessonPlanForm";
import { LessonPlanDetails } from "./features/lessonPlan/components/LessonPlanDetails";
import { EditLessonPlan } from "./features/lessonPlan/components/EditLessonPlan";
import { SavedPlansList } from "./features/lessonPlan/components/SavedPlansList";
import { UserManagement } from "./features/users/components/UserManagement";

const queryClient = new QueryClient();

// Accessing the variable safely via import.meta.env
const GOOGLE_CLIENT_ID = (import.meta.env as Record<string, string | undefined>)
  .VITE_GOOGLE_CLIENT_ID;

function App() {
  if (GOOGLE_CLIENT_ID == null || GOOGLE_CLIENT_ID === "") {
    console.error(
      "VITE_GOOGLE_CLIENT_ID is not defined in the environment variables.",
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID ?? ""}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Toaster position="top-center" />
            <Routes>
              {/* --- Public Routes (No Layout) --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* --- Protected Routes (With Layout) --- */}
              <Route element={<RequireAuth />}>
                <Route
                  path="/"
                  element={
                    <Layout>
                      <LessonPlanList />
                    </Layout>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <Layout>
                      <CreateLessonPlanForm />
                    </Layout>
                  }
                />
                <Route
                  path="/plan/:id"
                  element={
                    <Layout>
                      <LessonPlanDetails />
                    </Layout>
                  }
                />
                <Route
                  path="/plan/:id/edit"
                  element={
                    <Layout>
                      <EditLessonPlan />
                    </Layout>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <Layout>
                      <UserManagement />
                    </Layout>
                  }
                />
                <Route
                  path="/saved"
                  element={
                    <Layout>
                      <SavedPlansList />
                    </Layout>
                  }
                />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
