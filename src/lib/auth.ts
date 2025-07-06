import axios from "axios"

const API_BASE_URL = "https://dummyjson.com"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Types for API responses
export interface LoginResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
  refreshToken: string
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

// Login function
export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await api.post("/auth/login", {
      username,
      password,
      expiresInMins: 30, // optional, defaults to 60
    })

    // Store token in localStorage for future requests
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token)
      localStorage.setItem("refreshToken", response.data.refreshToken)
    }

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
    throw new Error("Network error occurred")
  }
}

// Get current user function
export async function getCurrentUser(): Promise<User> {
  try {
    const token = localStorage.getItem("authToken")
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get user info")
    }
    throw new Error("Network error occurred")
  }
}

// Refresh token function
export async function refreshAuthToken(): Promise<LoginResponse> {
  try {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      throw new Error("No refresh token found")
    }

    const response = await api.post("/auth/refresh", {
      refreshToken,
      expiresInMins: 30,
    })

    // Update stored tokens
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token)
      localStorage.setItem("refreshToken", response.data.refreshToken)
    }

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Token refresh failed")
    }
    throw new Error("Network error occurred")
  }
}

// Logout function
export function logoutUser(): void {
  localStorage.removeItem("authToken")
  localStorage.removeItem("refreshToken")
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("authToken")
}
