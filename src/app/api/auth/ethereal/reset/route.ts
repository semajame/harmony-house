import { NextApiRequest, NextApiResponse } from "next";
import { AppDataSource } from "@/app/lib/data-source";
import { User } from "@/app/lib/entities/users";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { token, newPassword } = req.body as {
    token: string;
    newPassword: string;
  };
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOneBy({ resetToken: token });

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await userRepo.save(user);

  res.json({ message: "Password reset successful" });
}
