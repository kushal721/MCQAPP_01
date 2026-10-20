import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api",
});

// Pulls a human-readable message out of an axios error.
export const errorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  (error?.request && !error?.response
    ? "Can't reach the server. Is the backend running?"
    : fallback);

const data = (promise) => promise.then((res) => res.data);

export const api = {
  stats: () => data(client.get("/stats")),

  getCourses: () => data(client.get("/course/getAllCourse")),
  getCourse: (id) => data(client.get(`/course/getCourse/${id}`)),
  addCourse: (body) => data(client.post("/course/addCourse", body)),
  updateCourse: (id, body) => data(client.put(`/course/updateCourse/${id}`, body)),
  deleteCourse: (id) => data(client.delete(`/course/deleteCourse/${id}`)),

  getSubjects: (courseId) =>
    data(client.get(`/subject/getSubjectByCourse/${courseId}`)).then(
      (res) => res.subjects
    ),
  getSubject: (id) => data(client.get(`/subject/getSubject/${id}`)),
  addSubject: (body) => data(client.post("/subject/addSubject", body)),
  updateSubject: (id, body) =>
    data(client.put(`/subject/updateSubject/${id}`, body)),
  deleteSubject: (id) => data(client.delete(`/subject/deleteSubject/${id}`)),

  getQuestion: (id) => data(client.get(`/question/getQuestion/${id}`)),
  getQuestions: (subjectId) =>
    data(client.get(`/question/getQuestionsBySubject/${subjectId}`)),
  addQuestion: (body) => data(client.post("/question/addQuestion", body)),
  updateQuestion: (id, body) =>
    data(client.put(`/question/updateQuestion/${id}`, body)),
  deleteQuestion: (id) => data(client.delete(`/question/deleteQuestion/${id}`)),

  // Returns null when every question in the subject has been attempted.
  nextQuestion: (subjectId, userId) =>
    client
      .get(`/question/getQuestionBySubject/${subjectId}`, { params: { userId } })
      .then((res) => res.data)
      .catch((error) => {
        if (error?.response?.status === 404) return null;
        throw error;
      }),
  recordAttempt: (body) =>
    client
      .post("/question/attemptedQuestion", body)
      .then((res) => res.data)
      // 409 means it was already recorded; the answer is still returned.
      .catch((error) => {
        if (error?.response?.status === 409) return error.response.data;
        throw error;
      }),
  getProgress: (courseId, userId) =>
    data(client.get(`/question/progress/${courseId}`, { params: { userId } })),
  resetProgress: (subjectId, userId) =>
    data(
      client.delete(`/question/resetProgress/${subjectId}`, { params: { userId } })
    ),
};
