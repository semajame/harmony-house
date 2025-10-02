import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

interface RegisterFormProps extends React.ComponentProps<"form"> {
  form: {
    username: string
    password: string
    phone: string
    email: string
    name: string
  }
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function SignUpForm({
  className,
  form,
  onFormChange,
  onSubmit,
  ...props
}: RegisterFormProps) {
  const [strength, setStrength] = useState<string>("")

  // Simple password strength checker
  useEffect(() => {
    const password = form.password
    if (!password) {
      setStrength("")
      return
    }

    if (password.length >= 8) {
      setStrength("Strong Password")
      return
    }

    let score = 0
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 5) setStrength("Weak Password")
    else if (score >= 8) setStrength("Strong Password")
  }, [form.password])

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your credentials below to sign up
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            required
            value={form.username}
            onChange={onFormChange}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={onFormChange}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@gmail.com"
            required
            value={form.email}
            onChange={onFormChange}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            placeholder="09XXXXX"
            required
            value={form.phone}
            onChange={onFormChange}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={8} // enforce 8 chars
            required
            value={form.password}
            onChange={onFormChange}
          />
          {strength && (
            <p
              className={cn(
                "text-xs mt-1",
                strength === "Weak Password" && "text-red-500",

                strength === "Strong Password" && "text-green-600"
              )}
            >
              {strength}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Register
        </Button>
      </div>
    </form>
  )
}
