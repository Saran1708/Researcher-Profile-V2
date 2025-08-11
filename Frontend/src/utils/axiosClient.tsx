import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: API_BASE,
});

// Flag to track if token refresh is in progress
let isRefreshing = false;
// Queue of callbacks to call once refresh is done
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor → attach access token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('[Axios] Sending request to:', config.url);
    if (token) {
      console.log('[Axios] Attaching access token:', token);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[Axios] No access token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('[Axios] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor → refresh token on 401
axiosClient.interceptors.response.use(
  (response) => {
    console.log('[Axios] Response OK from:', response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If refresh in progress, queue this request and wait for refresh to finish
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosClient(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          console.error('[Axios] No refresh token found. Redirecting to login.');
          throw new Error('No refresh token');
        }

        console.log('[Axios] Sending refresh token request...');
        const res = await axios.post(`${API_BASE}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        console.log('[Axios] New access token received:', newAccessToken);

        localStorage.setItem('access_token', newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error('[Axios] Token refresh failed:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error('[Axios] Response error:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;
