import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import { AppDataSource, getDatabaseConnection } from "@/app/lib/data-source" // your TypeORM datasource
import { User } from "@/app/lib/entities/users" // your User entity

export async function POST(req: Request) {
  const { email } = await req.json()

  const db = await getDatabaseConnection()
  const userRepo = db.getRepository(User)
  const user = await userRepo.findOne({ where: { email } })

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    )
  }

  // 1. Generate reset token
  const token = jwt.sign({ email }, process.env.RESET_TOKEN_SECRET!, {
    expiresIn: "1h",
  })

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  // 2. Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔑 Reset your password",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>Hello,</p>
      <p>You recently requested to reset your password. Click the button below to set a new one:</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="background-color: #4F46E5; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block; font-weight: bold;">
          Reset Password
        </a>
      </p>

      <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #1d4ed8;">${resetLink}</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <p style="font-size: 12px; color: #6b7280;">
        If you didn’t request a password reset, you can safely ignore this email.
      </p>
      <p style="font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Your App Name
      </p>
    </div>
  `,
  })

  return NextResponse.json({ success: true, message: "Reset link sent!" })
}
