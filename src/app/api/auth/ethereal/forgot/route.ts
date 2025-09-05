import { NextApiRequest, NextApiResponse } from "next";
import { AppDataSource } from "@/app/lib/data-source";
import { User } from "../../../../lib/entities/users";
import crypto from "crypto";
import { sendMail } from "../../../../lib/ethereal/mailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body as { email: string };
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const token = crypto.randomBytes(20).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 10;

  await userRepo.save(user);

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  await sendMail({
    to: user.email,
    subject: "Password Reset",
    text: `Click here to reset: ${resetLink}`,
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  res.json({ message: "Reset email sent. Check console for preview URL." });
}
