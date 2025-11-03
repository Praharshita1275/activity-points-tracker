import axios from "axios";

// Configure a shared Axios instance with a base URL from Vite env
// Set VITE_API_BASE_URL in your hosting env (e.g., Render) to your backend URL
// Example: VITE_API_BASE_URL=https://activity-points-tracker-backend.onrender.com
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5007";

export const api = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Helper for multipart/form-data when uploading files
export const apiMultipart = axios.create({
	baseURL,
	headers: {
		"Content-Type": "multipart/form-data",
	},
});

// Attach Authorization header from localStorage token on each request
const attachAuth = (config) => {
	try {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers = config.headers || {};
			config.headers["Authorization"] = `Bearer ${token}`;
		}
	} catch {}
	return config;
};

api.interceptors.request.use(attachAuth);
apiMultipart.interceptors.request.use(attachAuth);

export default api;

