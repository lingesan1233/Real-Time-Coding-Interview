import axios from "axios";

const API = axios.create({
  baseURL: "https://real-time-coding-interview.onrender.com/api"
});


// Add token automatically to every request
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = token;
  }

  return req;
});


// AUTH API

export const loginUser = (data) =>
  API.post("/auth/login", data);


// ADMIN API

export const createCandidate = (data) =>
  API.post("/admin/createCandidate", data);


export const createInterview = (data) =>
  API.post("/admin/createInterview", data);


export const getAllInterviews = () =>
  API.get("/admin/interviews");


// CANDIDATE API

export const getCandidateInterviews = (candidateId) =>
  API.get(`/interview/candidate/${candidateId}`);


// SUBMIT SOLUTION

export const submitSolution = (interviewId, code) =>
  API.post(`/interview/submit/${interviewId}`, {
    answer: code
  });


export default API;