import validateRegisterBody from "@server/middleware/auth/validateRegisterBody";
import db from "@server/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { RegisterBodyInterface } from "@server/interfaces/requestBody";
import { createAccount } from "@server/services/AccountService";
import runApiLimitMiddleware from "@server/middleware/runApiLimitMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await runApiLimitMiddleware(req, res);

  await db();

  if (req.method === "POST") {
    let body: RegisterBodyInterface;

    try {
      body = validateRegisterBody(req);
    } catch (err) {
      console.error("Error in register: ", err);
      return res.status(400).json({ message: err });
    }

    try {
      const accountCreated = await createAccount(
        body,
        req.body.isBusinessAccount,
      );

      if (accountCreated) {
        return res.status(200).json({ message: "Register successful." });
      } else {
        return res
          .status(500)
          .json({ message: "Error when creating account, please try again." });
      }
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}
