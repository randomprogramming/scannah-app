import { WithSessionRequest } from "@server/interfaces/handlerParams";
import runApiLimitMiddleware from "@server/middleware/runApiLimitMiddleware";
import { loginAccount } from "@server/services/AccountService";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await runApiLimitMiddleware(req, res, 10);

  await db();

  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(406)
        .json({ message: "Email and password may not be empty." });

    try {
      await loginAccount(req, email, password);

      return res.status(200).json({ message: "Login successful." });
    } catch (err) {
      console.error("Error when logging in: ", err);
      return res.status(406).json({ message: err });
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
