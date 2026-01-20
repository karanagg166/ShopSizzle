import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/api", // Relative path works for same-origin (Next.js)
    withCredentials: true, // send cookies to the server
});

export default axiosInstance;
