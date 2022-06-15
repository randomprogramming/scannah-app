import { createCampaign } from "@server/services/CampaignService";
import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import { CompanyInterface } from "@server/models/Company";
import { getAccountCompany } from "@server/services/AccountService";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";
import Campaign from "@server/models/Campaign";
import CampaignType from "@server/models/CampaignType";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  // TODO: Find a better place to store these, like when the database first starts up
  // CampaignType.create({
  //   title: CAMPAIGN_TYPES_ENUM.giveaway,
  //   description:
  //     "The more scanned codes a customer has, the larger the chance that they win the giveaway.",
  // });

  // CampaignType.create({
  //   title: CAMPAIGN_TYPES_ENUM.luckyTicket,
  //   description:
  //     "There's a small sample of winning codes, while the rest will yield nothing.",
  // });

  // CampaignType.create({
  //   title: CAMPAIGN_TYPES_ENUM.pointCollector,
  //   description:
  //     "Customers scan codes to earn points and compete against each other on the leader board.",
  // });

  if (req.method === "POST") {
    const { name, campaignTypeId, allowsMultipleEntries } = req.body;

    try {
      // If the wanted campaign type doesn't exist, return error
      if (!(await CampaignType.exists({ _id: campaignTypeId }))) {
        return res.status(400).json({ message: "Unknown campaign type." });
      }

      const accountCompany: CompanyInterface = await getAccountCompany(
        req.session.get(SESSION_NAME)._id,
      );

      const campaignCreatedId = await createCampaign(
        name,
        accountCompany,
        campaignTypeId,
        allowsMultipleEntries,
      );

      if (campaignCreatedId) {
        return res.status(200).send(campaignCreatedId);
      } else {
        return res
          .status(500)
          .json({ message: "Error when creating campaign" });
      }
    } catch (err) {
      console.error("Error when creating campaign: ", err);
      return res.status(500).json({ message: "Error when creating campaign" });
    }
  } else if (req.method === "GET") {
    const accountCompany: CompanyInterface | null = await getAccountCompany(
      req.session.get(SESSION_NAME)._id,
    );

    if (accountCompany) {
      await accountCompany
        .populate({
          path: "campaigns",
          model: Campaign,
          populate: { path: "campaignType", model: CampaignType },
        })
        .execPopulate();

      return res.status(200).json(accountCompany.campaigns);
    } else {
      return res.status(403).json({
        message: "You will need a business account for this function.",
      });
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
