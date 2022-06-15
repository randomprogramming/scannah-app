import { CAMPAIGN_TYPES_ENUM, SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import Account from "@server/models/Account";
import CampaignProps, {
  CampaignPropsInterface,
  GiveawayCampaignProps,
  LuckyTicketCampaignProps,
  PointCollectorCampaignProps,
} from "@server/models/CampaignProps";
import { AccountInterface } from "@server/models/Account";
import CampaignType, {
  CampaignTypeBaseInterface,
} from "@server/models/CampaignType";
import Company, { CompanyInterface } from "@server/models/Company";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";
import Campaign from "pages/dashboard/campaigns/[_id]";
import { CampaignInterface } from "@server/models/Campaign";
import Code from "@server/models/Code";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  const sessionAccountId = req.session.get(SESSION_NAME)._id;

  if (req.method === "POST") {
    const { campaignPropsId, participantAccountId } = req.body;

    let campaignProps: CampaignPropsInterface = await CampaignProps.findOne({
      _id: campaignPropsId,
      isRedeemed: false,
    })
      .populate({ path: "campaign", model: Campaign })
      .select("+activeWinningTickets")
      .populate({ path: "activeWinningTickets", model: Code });

    if (!campaignProps) {
      console.error("The wanted campaign props were not found for redeeming.");
      return res.status(400).json({ message: "Campaign not found." });
    }

    const campaignPropsCampaign = <CampaignInterface>campaignProps.campaign;

    const hostAccount: AccountInterface = await Account.findById(
      sessionAccountId,
    ).populate({
      path: "company",
      model: Company,
      populate: {
        path: "campaigns",
        model: Campaign,
      },
    });

    const hostAccountCompany = <CompanyInterface>hostAccount.company;
    const hostAccountCampaigns = <CampaignInterface[]>(
      hostAccountCompany.campaigns
    );

    // We have to check if the specified campaign and campaignProps belong to the
    // user that made the request
    let hostCampaign: CampaignInterface;
    for (const hostCampaignIter of hostAccountCampaigns) {
      if (hostCampaignIter.id === campaignPropsCampaign.id) {
        hostCampaign = hostCampaignIter;
        break;
      }
    }

    if (!hostCampaign) {
      return res
        .status(503)
        .json({ message: "You do not have access to this campaign." });
    }

    await hostCampaign
      .populate({ path: "campaignType", model: CampaignType })
      .execPopulate();

    switch ((<CampaignTypeBaseInterface>hostCampaign.campaignType).title) {
      case CAMPAIGN_TYPES_ENUM.luckyTicket:
        campaignProps = <LuckyTicketCampaignProps>campaignProps;

        let shouldSave = false;
        for (const prop of campaignProps.scannedWinningTickets) {
          if (prop.winningAccount == participantAccountId && !prop.isRedeemed) {
            prop.isRedeemed = true;
            prop.redeemDate = new Date();
            shouldSave = true;
            break;
          }
        }

        if (shouldSave) {
          try {
            await campaignProps.save();
          } catch (err) {
            console.error("Error when redeeming lucky ticket: ", err);
            return res
              .status(500)
              .json({ message: "Error when saving props." });
          }
        }
        break;

      case CAMPAIGN_TYPES_ENUM.giveaway:
        campaignProps = <GiveawayCampaignProps>campaignProps;

        campaignProps.isRedeemed = true;
        campaignProps.redeemDate = new Date();

        try {
          campaignProps.save();
        } catch (err) {
          console.error("Error when redeeming lucky ticket: ", err);
          return res.status(500).json({ message: "Error when saving props." });
        }
        break;

      case CAMPAIGN_TYPES_ENUM.pointCollector:
        campaignProps = <PointCollectorCampaignProps>campaignProps;

        let amountOfPoints: number;
        try {
          amountOfPoints = parseInt(req.body.amountOfPoints);

          if (isNaN(amountOfPoints)) {
            throw "Passed param is not a number";
          }
        } catch (err) {
          console.error(
            "Error when converting point number of number type: ",
            err,
          );
          return res
            .status(400)
            .json({ message: "Invalid amount of points entered." });
        }

        if (campaignProps.collectedPoints >= amountOfPoints) {
          campaignProps.collectedPoints -= amountOfPoints;
        } else {
          return res.status(400).json({
            message:
              "User does not have " + amountOfPoints + " points to redeem.",
          });
        }

        try {
          campaignProps.save();
        } catch (err) {
          console.error("Error when redeeming point collector points: ", err);
          return res.status(500).json({ message: "Error when saving props." });
        }
        break;

      default:
        console.error("Unknown campaign type.");
    }

    res.status(200).json({ message: "Redeemed!" });
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
