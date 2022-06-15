import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import { getCampaignParticipation } from "@server/services/ParticipationService";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  const { accountId } = req.query;

  const sessionAccountId = req.session.get(SESSION_NAME)._id;

  if (req.method === "GET" && typeof accountId === "string") {
    const participation = await getCampaignParticipation(
      sessionAccountId,
      accountId,
    );

    res.status(200).json(participation);
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
