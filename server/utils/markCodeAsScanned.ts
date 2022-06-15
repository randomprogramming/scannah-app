import { CAMPAIGN_TYPES_ENUM } from "@server/constants";
import Campaign, { CampaignInterface } from "@server/models/Campaign";
import CampaignProps, {
  CampaignPropsInterface,
  GiveawayCampaignProps,
  LuckyTicketCampaignProps,
  PointCollectorCampaignProps,
  ILuckyTicketWinningTicket,
} from "@server/models/CampaignProps";
import CampaignType, {
  CampaignTypeInterface,
} from "@server/models/CampaignType";
import Code, { CodeInterface } from "@server/models/Code";
import Company, { CompanyInterface } from "@server/models/Company";
import { ClientSession, Schema } from "mongoose";
import mongoose from "mongoose";
import ScannedOwnCodeError from "@server/throwables/ScannedOwnCodeError";

// Checks which campaign type this is, and awards the points to the account
// Or whatever that campaign type should do
async function processCampaignType(
  campaign: CampaignInterface,
  accountId: Schema.Types.ObjectId,
  session: ClientSession,
  scannedCode: CodeInterface,
): Promise<string> {
  const campaignType = <CampaignTypeInterface>campaign.campaignType;

  let campaignPropsQuery: CampaignPropsInterface;

  const scannedCodeId = scannedCode.id;

  let returnString = "";

  if (campaignType.title === CAMPAIGN_TYPES_ENUM.giveaway) {
    campaignPropsQuery = <GiveawayCampaignProps>await CampaignProps.findOne({
      campaign: campaign.id,
      account: accountId,
      isRedeemed: false,
      isWinner: false,
    });

    if (campaignPropsQuery) {
      if (campaign.allowsMultipleEntries) {
        campaignPropsQuery.giveawayEntries += 1;
      } else if (campaignPropsQuery.giveawayEntries === 0) {
        campaignPropsQuery.giveawayEntries = 1;
      }
    } else {
      campaignPropsQuery = new CampaignProps({
        account: accountId,
        giveawayEntries: 1,
        campaign: campaign.id,
      }) as GiveawayCampaignProps;

      campaign.campaignProps.push(campaignPropsQuery.id);
    }

    if (campaignPropsQuery.giveawayEntries === 1) {
      returnString =
        "You now have " +
        campaignPropsQuery.giveawayEntries +
        " giveaway entry. Good luck!";
    } else {
      returnString =
        "You now have " +
        campaignPropsQuery.giveawayEntries +
        " giveaway entries. Good luck!";
    }
  } else if (campaignType.title === CAMPAIGN_TYPES_ENUM.luckyTicket) {
    campaignPropsQuery = <LuckyTicketCampaignProps>(
      await CampaignProps.findOne({ campaign: campaign.id }).select(
        "activeWinningTickets scannedWinningTickets",
      )
    );

    if (campaignPropsQuery) {
      if (
        // If the scanned code is within the winning codes
        (<Schema.Types.ObjectId[]>(
          campaignPropsQuery.activeWinningTickets
        )).filter((code) => code == scannedCodeId).length > 0
      ) {
        // Remove the winning code from the winning codes array
        campaignPropsQuery.activeWinningTickets = (<Schema.Types.ObjectId[]>(
          campaignPropsQuery.activeWinningTickets
        )).filter((code) => code != scannedCodeId);

        let winningTicketObj: ILuckyTicketWinningTicket = {
          winningAccount: accountId,
          isRedeemed: false,
          winningCode: scannedCodeId,
          redeemDate: null,
        };
        campaignPropsQuery.scannedWinningTickets.push(winningTicketObj);

        returnString = "Congratulations, you just scanned a winning code!";
      } else {
        returnString =
          "Unfortunately that was not a winning code, keep scanning.";
      }
    } else {
      campaignPropsQuery = new CampaignProps({
        campaign: campaign.id,
      });

      campaign.campaignProps.push(campaignPropsQuery.id);
    }
  } else if (campaignType.title === CAMPAIGN_TYPES_ENUM.pointCollector) {
    const CODE_SCAN_POINTS = scannedCode.points;
    campaignPropsQuery = <PointCollectorCampaignProps>(
      await CampaignProps.findOne({
        campaign: campaign.id,
        account: accountId,
      })
    );

    if (campaignPropsQuery) {
      campaignPropsQuery.collectedPoints += CODE_SCAN_POINTS;
    } else {
      campaignPropsQuery = new CampaignProps({
        account: accountId,
        campaign: campaign.id,
        collectedPoints: CODE_SCAN_POINTS,
      }) as PointCollectorCampaignProps;

      campaign.campaignProps.push(campaignPropsQuery.id);
    }

    returnString =
      "Code scanned, you now have " +
      campaignPropsQuery.collectedPoints +
      " points.";
  }

  await campaignPropsQuery.save({ session });
  return returnString;
}

export default async function markCodeAsScanned(
  codeId: string,
  campaignId: string,
  accountId: Schema.Types.ObjectId,
  companyId: string,
): Promise<string> {
  if (
    !(
      mongoose.isValidObjectId(campaignId) &&
      mongoose.isValidObjectId(accountId) &&
      mongoose.isValidObjectId(companyId)
    )
  ) {
    // Check that all the IDs are actually valid ObjectIDs
    throw "Invalid ID.";
  }

  const code: CodeInterface = await Code.findById(codeId).select("+scannedBy");
  const campaign: CampaignInterface = await Campaign.findById(campaignId)
    .populate({
      path: "campaignProps",
      model: CampaignProps,
    })
    .populate({
      path: "campaignType",
      model: CampaignType,
    });
  const company: CompanyInterface = await Company.findById(companyId);

  if (!code || !campaign || !company) {
    throw "The code that you tried to scan does not exist.";
  }

  // If the codes company or the codes campaign don't match the
  // provided company/campaign, throw an error
  if (code.company != company.id || code.campaign != campaign.id) {
    throw "Invalid code ID, please try again.";
  }

  if ((<Schema.Types.ObjectId[]>company.accounts).includes(accountId)) {
    throw new ScannedOwnCodeError("You scanned your own Code.");
  }

  if (!campaign.isActive) {
    throw "Unfortunately, that campaign is no longer active.";
  }

  if (code.isScanned) {
    throw "Code has already been scanned.";
  }

  if (
    (<CampaignTypeInterface>campaign.campaignType).title ===
    CAMPAIGN_TYPES_ENUM.giveaway
  ) {
    const giveawayCampaignProps = <GiveawayCampaignProps>(
      await CampaignProps.findOne({
        campaign: campaign.id,
        account: accountId,
      })
    );

    // If the campaign only allows you to enter once and the user tries to scan
    // another code, show them an error message
    if (
      giveawayCampaignProps &&
      !campaign.allowsMultipleEntries &&
      giveawayCampaignProps.giveawayEntries !== 0
    ) {
      throw "This campaign only allows you to enter once in the giveaway.";
    }
  }

  // Session stuff
  const session = await Code.startSession();
  session.startTransaction();

  // Code stuff
  code.isScanned = true;
  code.scannedBy = accountId;
  code.dateScanned = new Date();

  // Campaign stuff
  campaign.numberOfActiveCodes -= 1;
  campaign.numberOfScannedCodes += 1;

  let returnMessage = "";
  // Campaign props stuff
  // This function might modify the campaign, so it must always be BEFORE campaign.save
  try {
    returnMessage = await processCampaignType(
      campaign,
      accountId,
      session,
      code,
    );
  } catch (err) {
    console.error("Error when processing campaign type: ", err);
    throw "There was an error when scanning the code, please try again later.";
  }

  await code.save({ session });
  await campaign.save({ session });

  try {
    await session.commitTransaction();
    session.endSession();

    return returnMessage;
  } catch (err) {
    console.error(
      "Error when committing transaction in markCodeAsScanned: ",
      err,
    );
    session.endSession();
    throw "There was an error when scanning the code, please try again later.";
  }
}
