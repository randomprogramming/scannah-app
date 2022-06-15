import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";
import CampaignType from "@server/models/CampaignType";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  if (req.method === "GET") {
    return res.status(200).json(await CampaignType.find({}));
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
