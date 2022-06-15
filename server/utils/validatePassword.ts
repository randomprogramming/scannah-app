import bcrypt from "bcryptjs";

export default function (password: string, hashedPassword: string) {
  return bcrypt.compareSync(password, hashedPassword);
}
