// BUG: Missing proper TypeScript types and error handling

const API_BASE_URL = "https://dummyjson.com"

// BUG: No proper class structure
function ApiClient(baseURL) {
  this.baseURL = baseURL
}

// BUG: Missing async/await and proper error handling
ApiClient.prototype.request = function (endpoint, options = {}) {
  const url = `${this.baseURL}${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  console.log(`Making request to: ${url}`)

  // BUG: No error handling
  return fetch(url, {
    ...options,
    headers,
  }).then((response) => response.json())
}

// BUG: Missing method implementation
ApiClient.prototype.post = function (endpoint, body) {
  return this.request(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

const apiClient = new ApiClient(API_BASE_URL)

// BUG: No proper error handling
export function loginUser(username, password) {
  return apiClient.post("/auth/login", {
    username,
    password,
    expiresInMins: 30,
  })
}
