import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import {
  scannedCodesFromLastWeek,
  codesScannedByAccount,
} from "@server/services/DashboardStats";
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

  const isBusinessAccount = req.session.get(SESSION_NAME).isBusinessAccount;

  if (req.method === "GET") {
    if (isBusinessAccount) {
      return res
        .status(200)
        .send(await scannedCodesFromLastWeek(sessionAccountId));
    } else {
      return res
        .status(200)
        .send(await codesScannedByAccount(sessionAccountId));
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
