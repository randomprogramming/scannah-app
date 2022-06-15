import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import { SESSION_NAME } from "@server/constants";
import SessionAccount from "@server/interfaces/SessionAccount";

// Get the currently logged in user and some info about them
async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  let sessionAccount: SessionAccount = { isLoggedIn: false };
  const session = req.session.get(SESSION_NAME);

  if (session) {
    sessionAccount = session;
  }

  return res.json(sessionAccount);
}

export default withSession(handler);
