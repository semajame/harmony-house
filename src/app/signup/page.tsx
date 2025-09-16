"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GalleryVerticalEnd } from "lucide-react"
import { SignUpForm } from "@/components/forms-buttons/signup-form"

import Image from "next/image"

export default function SignUp() {
  const router = useRouter()

  const [form, setForm] = useState({
    username: "",
    password: "",
    phone: "",
    email: "",
    name: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const res = await fetch("/api/customer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
    } else {
      setSuccess("Account created! You can now log in.")
      router.push("/login") // Redirect to login or home
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/images/harmony-house-logo.png"
              alt="Logo Image"
              width={50}
              height={50}
            />
            Harmony House
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm
              form={form}
              onFormChange={handleChange}
              onSubmit={handleSubmit}
            />
            {error && (
              <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
            )}
            {success && (
              <p className="mt-4 text-sm text-green-500 text-center">
                {success}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="relative w-full h-full">
        <Image
          src="/images/login-image-2.jpg"
          alt="Image"
          className="object-cover"
          fill
        />
      </div>
    </div>
  )
}
