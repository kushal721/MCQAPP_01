import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import PublicLayout from "./components/PublicLayout";
import Home from "./pages/Home";
import CoursePage from "./pages/CoursePage";
import QuizPage from "./pages/QuizPage";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import ManageCourses from "./pages/Admin/ManageCourses";
import ManageSubjects from "./pages/Admin/ManageSubjects";
import ManageQuestions from "./pages/Admin/ManageQuestions";
import QuestionForm from "./pages/Admin/QuestionForm";

function App() {
  return (
    <ToastProvider>
      <Router>
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

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="courses/:courseId" element={<ManageSubjects />} />
            <Route path="subjects/:subjectId" element={<ManageQuestions />} />
            <Route path="questions/new" element={<QuestionForm />} />
            <Route path="questions/:questionId/edit" element={<QuestionForm />} />
            <Route path="*" element={<NotFound admin />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
