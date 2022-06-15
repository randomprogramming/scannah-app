import { withIronSession } from "next-iron-session";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import { NextApiResponse } from "next";

export default function withSession(
  handler: (req: WithSessionRequest, res: NextApiResponse) => void,
) {
  return withIronSession(handler, {
    password: process.env.AUTH_PASSWORD,
    cookieName: process.env.AUTH_COOKIE_NAME,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
