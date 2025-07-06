// API interceptor for DummyJSON authentication
const API_BASE_URL = "https://dummyjson.com"

// Simple interceptor concept
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  // Request interceptor
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    // Add default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    console.log(`Making request to: ${url}`)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Response received:", data)
      return data
    } catch (error) {
      console.error("Request failed:", error)
      throw error
    }
  }

  // POST method
  async post(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL)

// Login function using the interceptor
export async function loginUser(username: string, password: string) {
  try {
    const response = await apiClient.post("/auth/login", {
      username,
      password,
      expiresInMins: 30,
    })

    return response
  } catch (error) {
    console.error("Login failed:", error)
    throw new Error("Authentication failed")
  }
}
