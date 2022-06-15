import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";
import Account, { AccountInterface } from "@server/models/Account";
import { CAMPAIGN_TYPES_ENUM, SESSION_NAME } from "@server/constants";
import Code, { CodeInterface } from "@server/models/Code";
import Company, { CompanyInterface } from "@server/models/Company";
import { Schema } from "mongoose";
import Campaign, { CampaignInterface } from "@server/models/Campaign";
import CampaignType, {
  CampaignTypeInterface,
} from "@server/models/CampaignType";
import CampaignProps, {
  CampaignPropsInterface,
  LuckyTicketCampaignProps,
} from "@server/models/CampaignProps";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  if (req.method === "GET") {
    const { codeId } = req.query;

    if (codeId && typeof codeId === "string") {
      const account: AccountInterface = await Account.findById(
        req.session.get(SESSION_NAME)._id,
      ).populate({ path: "company", model: Company });

      if (!account) {
        return res.status(400).send("Invalid account.");
      }

      const accountCompany = account.company as CompanyInterface;

      const companyCampaigns =
        accountCompany.campaigns as Schema.Types.ObjectId[];

      const code: CodeInterface = await Code.findById(codeId)
        .populate({
          path: "campaign",
          model: Campaign,
          select: "campaignType name isActive",
          populate: {
            path: "campaignType",
            model: CampaignType,
          },
        })
        .select("+scannedBy")
        .populate({
          path: "scannedBy",
          model: Account,
          select: "firstName lastName",
        });

      const codeCampaign = code.campaign as CampaignInterface;

      const campaignProps: CampaignPropsInterface = await CampaignProps.findOne(
        {
          campaign: codeCampaign.id,
        },
      ).select("scannedWinningTickets activeWinningTickets");

      // Check if this code actually belongs to user
      if (companyCampaigns.includes((<CampaignInterface>code.campaign).id)) {
        let returnedObj: any = { ...code.toObject() };

        if (
          (<CampaignTypeInterface>codeCampaign.campaignType).title ===
          CAMPAIGN_TYPES_ENUM.luckyTicket
        ) {
          // Inject the 'isWinningCode' into the returned object
          returnedObj.isWinningCode = (<LuckyTicketCampaignProps>(
            campaignProps
          )).checkIsWinningCode(code.id);
        }

        return res.status(200).send(returnedObj);
      } else {
        return res
          .status(503)
          .json({ message: "You do not have access to that code." });
      }
    } else {
      return res.status(400).json({ message: "Invalid Code ID." });
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
