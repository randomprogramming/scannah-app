import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import { CompanyInterface } from "@server/models/Company";
import { getAccountCompany } from "@server/services/AccountService";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";
import Campaign, { CampaignInterface } from "@server/models/Campaign";
import Code from "@server/models/Code";
import CampaignType from "@server/models/CampaignType";
import CampaignProps from "@server/models/CampaignProps";
import Account from "@server/models/Account";
import DownloadLink from "@server/models/DownloadLink";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  const { campaignId } = req.query;

  const accountCompany: CompanyInterface | null = await getAccountCompany(
    req.session.get(SESSION_NAME)._id,
  );

  if (req.method === "GET" && campaignId) {
    if (accountCompany) {
      await accountCompany
        .populate({ path: "campaigns", model: Campaign })
        .execPopulate();

      // Fetch the campaign, and inject the unique people reached field
      const campaign = await (<CampaignInterface[]>accountCompany.campaigns)
        .find((campaign: CampaignInterface) => campaign.id === campaignId)
        .populate({ path: "campaignType", model: CampaignType })
        .populate({
          path: "campaignProps",
          model: CampaignProps,
          populate: [
            {
              path: "account",
              model: Account,
              select: "firstName",
            },
          ],
        })
        .populate({ path: "downloadLink", model: DownloadLink })
        .execPopulate();

      const winningEntriesCount = await CampaignProps.countDocuments({
        campaign: campaign.id,
        isWinner: true,
      });

      const redeemedEntriesCount = await CampaignProps.countDocuments({
        campaign: campaign.id,
        isWinner: true,
        isRedeemed: true,
      });

      const codesScannedByUniqueAccounts = await Code.find({
        campaign: campaign.id,
        isScanned: true,
      }).distinct("scannedBy");

      // Inject some values which the frontend needs
      const campaignPOJO: any = campaign.toObject();
      campaignPOJO.numberOfUniquePeopleReached =
        codesScannedByUniqueAccounts.length;
      campaignPOJO.winningEntriesCount = winningEntriesCount;
      campaignPOJO.redeemedEntriesCount = redeemedEntriesCount;

      return res.status(200).json(campaignPOJO);
    } else {
      return res.status(403).json({
        message: "You will need a business account for this function.",
      });
    }
  } else if (req.method === "PATCH" && campaignId) {
    if (req.body && typeof req.body.isActive === "boolean") {
      if (accountCompany) {
        const campaign: CampaignInterface = await Campaign.findOne({
          _id: campaignId as string,
          company: accountCompany.id,
        });

        if (campaign) {
          campaign.isActive = req.body.isActive;
        }

        try {
          campaign.save();

          return res.status(200).json({ message: "Campaign updated." });
        } catch (err) {
          console.error("Campaign failed to save: ", err);

          return res.status(500).json({ message: "Failed to save campaign." });
        }
      }
    }

    return res.status(400).json({ message: "Invalid request." });
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
