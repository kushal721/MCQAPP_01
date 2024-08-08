import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CourseSubCategory from "./pages/CourseSubCategory";
import QuizPage from "./pages/QuizPage";
import AdminHome from "./pages/Admin/AdminHome";
import AddCourse from "./pages/Admin/AddCourse";
import AddSubject from "./pages/Admin/AddSubject";
import AddQuestion from "./pages/Admin/AddQuestion";
import ViewAllQuestions from "./pages/Admin/ViewAllQuestions";
import ViewCourses from "./pages/Admin/ViewCourses";
import ViewSubject from "./pages/Admin/ViewSubject";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/coursesubcategory" element={<courseSubCategory />} /> */}
          <Route path="/sub-categories" element={<CourseSubCategory />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>

        <Routes>
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/addCourse" element={<AddCourse />} />
          <Route path="/addSubject" element={<AddSubject />} />
          <Route path="/addQuestion" element={<AddQuestion />} />
          <Route path="/viewAllQuestion" element={<ViewAllQuestions />} />
          <Route path="/viewCourse" element={<ViewCourses />} />
          <Route path="/viewSubject" element={<ViewSubject />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
