import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import {
  getAccountSettings,
  setAccountSettings,
} from "@server/services/AccountService";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  const sessionAccountId = req.session.get(SESSION_NAME)._id;

  if (req.method === "GET") {
    try {
      const acc = await getAccountSettings(sessionAccountId);
      res.status(200).send(acc);
    } catch (err) {
      console.error("Error when fetching account settings: ", err);
      res.status(500).json({ message: err });
    }
  } else if (req.method === "POST") {
    const {
      firstName,
      lastName,
      email,
      password,
      repeatedPassword,
      avatarURL,
    } = req.body;

    try {
      if (
        await setAccountSettings(
          sessionAccountId,
          firstName,
          lastName,
          email,
          password,
          repeatedPassword,
          avatarURL,
        )
      ) {
        return res.status(200).json({ message: "Account updated." });
      } else {
        return res
          .status(400)
          .json({ message: "Failed to update account, please try again." });
      }
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
