import { WithSessionRequest } from "@server/interfaces/handlerParams";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  if (req.method === "POST") {
    req.session.destroy();
    res.status(200).send({ message: "You are now logged out." });
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
