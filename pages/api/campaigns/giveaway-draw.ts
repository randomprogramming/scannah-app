import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import { drawGiveawayWinners } from "@server/services/CampaignService";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { isValidObjectId } from "mongoose";
import { NextApiResponse } from "next";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  const { campaignId, numberOfDraws } = req.body;

  let { deactivateCampaignAfterDraw } = req.body;

  let numberOfDrawsNum: number;
  try {
    numberOfDrawsNum = parseInt(numberOfDraws);
  } catch (err) {
    return res.status(500).json({ message: "Invalid number of draws." });
  }

  const accountId = req.session.get(SESSION_NAME)._id;

  if (typeof deactivateCampaignAfterDraw !== "boolean") {
    deactivateCampaignAfterDraw = false;
  }

  if (req.method === "POST") {
    if (
      campaignId &&
      typeof campaignId === "string" &&
      isValidObjectId(campaignId) &&
      numberOfDrawsNum &&
      !isNaN(numberOfDrawsNum)
    ) {
      try {
        await drawGiveawayWinners(
          campaignId,
          accountId,
          numberOfDrawsNum,
          deactivateCampaignAfterDraw,
        );
        return res.status(200).json({ message: "Winners have been drawn" });
      } catch (err) {
        console.error("Error when drawing giveaway winners: ", err);
        return res.status(500).json({ message: err });
      }
    } else {
      return res.status(400).json({ message: "Invalid POST body." });
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
