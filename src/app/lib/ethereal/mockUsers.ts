import bcrypt from "bcrypt";

export interface User {
  id: number;
  email: string;
  password: string;
  resetToken: string | null;
  resetTokenExpiry: number | null;
}

let users: User[] = [
  {
    id: 1,
    email: "test@example.com",
    password: bcrypt.hashSync("password123", 10),
    resetToken: null,
    resetTokenExpiry: null,
  },
];

export default users;
