import axios from "axios";

// Defaults to port 4000 on whatever host served the page, so the app also
// works when opened from another device via the machine's network address.
const client = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    `${window.location.protocol}//${window.location.hostname}:4000/api`,
});

// Admin token handling. The token is attached to every request once set;
// if the server rejects it (expired / revoked), onUnauthorized is called.
let onUnauthorized = () => {};

export const setAuthToken = (token) => {
  if (token) client.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete client.defaults.headers.common.Authorization;
};

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

client.interceptors.response.use(undefined, (error) => {
  const sentToken = Boolean(error?.config?.headers?.Authorization);
  if (error?.response?.status === 401 && sentToken) {
    onUnauthorized(error.response.data?.message);
  }
  return Promise.reject(error);
});

// Pulls a human-readable message out of an axios error.
export const errorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  (error?.request && !error?.response
    ? "Can't reach the server. Is the backend running?"
    : fallback);

// In development, sends UI crashes to the backend log for debugging.
export const reportClientError = (error, componentStack) => {
  if (!import.meta.env.DEV) return;
  client
    .post("/client-error", {
      message: String(error?.message || error),
      stack: error?.stack,
      componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
    })
    .catch(() => {});
};

const data = (promise) => promise.then((res) => res.data);

export const api = {
  login: (body) => data(client.post("/auth/login", body)),
  me: () => data(client.get("/auth/me")).then((res) => res.admin),

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
