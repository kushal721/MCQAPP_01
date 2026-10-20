import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import RequireAdmin from "./components/RequireAdmin";
import { AuthProvider } from "./lib/auth";
import { ToastProvider } from "./components/ui/Toast";
import PublicLayout from "./components/PublicLayout";
import Home from "./pages/Home";
import CoursePage from "./pages/CoursePage";
import QuizPage from "./pages/QuizPage";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/Admin/AdminLayout";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ManageCourses from "./pages/Admin/ManageCourses";
import ManageSubjects from "./pages/Admin/ManageSubjects";
import ManageQuestions from "./pages/Admin/ManageQuestions";
import QuestionForm from "./pages/Admin/QuestionForm";

// Remounting the boundary on navigation clears a previous page's error.
const RoutedBoundary = ({ children }) => {
  const { pathname } = useLocation();
  return <ErrorBoundary key={pathname}>{children}</ErrorBoundary>;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <RoutedBoundary>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/courses/:courseId" element={<CoursePage />} />
                <Route
                  path="/courses/:courseId/subjects/:subjectId"
                  element={<QuizPage />}
                />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="courses/:courseId" element={<ManageSubjects />} />
                <Route path="subjects/:subjectId" element={<ManageQuestions />} />
                <Route path="questions/new" element={<QuestionForm />} />
                <Route path="questions/:questionId/edit" element={<QuestionForm />} />
                <Route path="*" element={<NotFound admin />} />
              </Route>
            </Routes>
          </RoutedBoundary>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
