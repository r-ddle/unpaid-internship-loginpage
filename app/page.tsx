"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// API Interceptor for handling requests
class ApiInterceptor {
  static async post(url: string, data: any) {
    try {
      console.log("Making API request to:", url)
      console.log("Request data:", data)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("API response:", result)

      if (!response.ok) {
        throw new Error(result.message || "Login failed")
      }

      return result
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }
}

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "emilys",
    password: "emilyspass",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoginMode) {
      setError("Create account is just a placeholder - please switch to login mode")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const loginData = {
        username: formData.username,
        password: formData.password,
        expiresInMins: 30,
      }

      const response = await ApiInterceptor.post("https://dummyjson.com/auth/login", loginData)
      setSuccess("Login successful! Welcome back.")
      localStorage.setItem("authToken", response.token)
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setError("")
    setSuccess("")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-6xl h-auto min-h-[600px] lg:h-[700px] shadow-2xl overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col lg:flex-row">
          {/* Left Side - Form */}
          <div className="flex-1 bg-white p-6 sm:p-8 lg:p-12 flex flex-col order-2 lg:order-1">
            {/* Header with Logo and Navigation */}
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-900">Anywhere app.</span>
                </div>
                <nav className="hidden sm:flex space-x-4 lg:space-x-8">
                  <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm lg:text-base">
                    Home
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm lg:text-base">
                    Join
                  </Link>
                </nav>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
              <div className="mb-6 lg:mb-8">
                <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide mb-2">
                  {isLoginMode ? "WELCOME BACK" : "START FOR FREE"}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
                  {isLoginMode ? "Sign in to account." : "Create new account."}
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">
                  {isLoginMode ? "Don't have an account? " : "Already A Member? "}
                  <button onClick={toggleMode} className="text-blue-600 hover:underline font-medium">
                    {isLoginMode ? "Create Account" : "Log In"}
                  </button>
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4 lg:mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800 mb-4 lg:mb-6">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className={`space-y-${isLoginMode ? '6' : '4'}`}>
                {!isLoginMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-600">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                        placeholder="Michal"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-600">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                        placeholder="Masiak"
                      />
                    </div>
                  </div>
                )}

                {!isLoginMode && (
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-600">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                      placeholder="michal.masiak@anywhere.co"
                    />
                  </div>
                )}

                {isLoginMode && (
                  <div className="space-y-1">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-600">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-600">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 lg:pt-4">
                  <button type="button" className="text-sm text-gray-400 hover:text-gray-600">
                    Change method
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isLoginMode ? "Signing in..." : "Creating account..."}
                    </>
                  ) : isLoginMode ? (
                    "Sign in"
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Side - Mountain Image */}
          <div className="flex-1 relative overflow-hidden min-h-[200px] lg:min-h-0 order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-blue-500 to-teal-600">
              <Image
                src="/placeholder.svg?height=700&width=600"
                alt="Beautiful mountain lake with reflection"
                fill
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

              {/* Decorative elements */}
              <div className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white rounded-lg transform rotate-12"></div>
                </div>
              </div>

              {/* Floating circles for design */}
              <div className="absolute top-20 right-20 w-16 h-16 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute top-40 right-40 w-12 h-12 lg:w-20 lg:h-20 bg-white/20 rounded-full blur-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
