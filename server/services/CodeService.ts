import { CAMPAIGN_TYPES_ENUM } from "@server/constants";
import { AccountInterface } from "@server/models/Account";
import Campaign, { CampaignInterface } from "@server/models/Campaign";
import CampaignProps, {
  LuckyTicketCampaignProps,
} from "@server/models/CampaignProps";
import CampaignType, {
  CampaignTypeInterface,
} from "@server/models/CampaignType";
import Code, { CodeInterface } from "@server/models/Code";
import Company, { CompanyInterface } from "@server/models/Company";
import { ClientSession } from "mongoose";
import { Schema } from "mongoose";

export async function generateCodes(
  amount: number,
  account: AccountInterface,
  campaignId: Schema.Types.ObjectId,
  amountOfWinningCodes?: number,
  pointRewardAmount?: number,
): Promise<void> {
  await account.populate({ path: "company", model: Company }).execPopulate();

  // We only want to check the account that made the request,
  // Otherwise people could start campaigns for other peoples companies
  // We start from the account, get their company and check the companies campaigns
  const company: CompanyInterface = account.company as CompanyInterface;
  await company.populate({ path: "campaigns", model: Campaign }).execPopulate();

  let campaign: CampaignInterface;
  for (const companyCampaign of company.campaigns) {
    if ((companyCampaign as CampaignInterface).id === campaignId) {
      campaign = companyCampaign as CampaignInterface;
    }
  }

  // If the users company doesn't have an ID matching campaign, throw an error
  if (!campaign) {
    throw "Unknown campaign.";
  }

  const session = await Code.startSession();
  session.startTransaction();

  let generatedCodes: CodeInterface[] = [];

  try {
    for (let i = 0; i < amount; ++i) {
      generatedCodes.push(
        new Code({
          company: company.id,
          campaign: campaign.id,
        }),
      );

      if (!isNaN(pointRewardAmount)) {
        generatedCodes[i].points = pointRewardAmount;
      }
    }

    await addActiveCodes(
      generatedCodes.map((generatedCode) => generatedCode.id), // We only need the id
      campaign.id,
      session,
    );

    // Try saving with the current session and committing the transaction
    let insertedCodes: any[] | CodeInterface = await Code.insertMany(
      generatedCodes,
      {
        session,
      },
    );

    if (!Array.isArray(insertedCodes)) {
      throw "Inserted codes were not an array.";
    }

    if (amountOfWinningCodes) {
      await generateCodesWithWinningCodes(
        insertedCodes,
        campaign,
        session,
        amountOfWinningCodes,
      );
    }

    await campaign.save({ session });
    await session.commitTransaction();

    session.endSession();
  } catch (err) {
    console.error("Error when creating codes: ", err);
    session.endSession();
  }
}

async function addActiveCodes(
  codeIds: Schema.Types.ObjectId[],
  campaignId: Schema.Types.ObjectId,
  session: ClientSession,
) {
  const campaign: CampaignInterface = await Campaign.findById(
    campaignId,
  ).select("codes numberOfActiveCodes totalNumberOfCodes");

  if (!campaign) {
    throw "Selected campaign doesn't exist.";
  }

  campaign.codes = (<Schema.Types.ObjectId[]>campaign.codes).concat(codeIds);
  campaign.numberOfActiveCodes += codeIds.length;
  campaign.totalNumberOfCodes += codeIds.length;

  await campaign.save({ session });
}

// This is only meant for lucky ticket campaign, since it's the only one
// that can generate 'winning' codes
async function generateCodesWithWinningCodes(
  codes: CodeInterface[],
  campaign: CampaignInterface,
  session: ClientSession,
  amountOfWinningCodes: number,
) {
  const populatedCampaign = await campaign
    .populate({
      path: "campaignType",
      model: CampaignType,
    })
    .populate({
      path: "campaignProps",
      model: CampaignProps,
    })
    .execPopulate();

  if (
    (<CampaignTypeInterface>populatedCampaign.campaignType).title !==
    CAMPAIGN_TYPES_ENUM.luckyTicket
  ) {
    throw "This type of campaign can't generate winning codes.";
  }

  let campaignProps: LuckyTicketCampaignProps;
  // Lucky ticket campaign can only have one campaign props
  if (populatedCampaign.campaignProps.length !== 1) {
    campaignProps = new CampaignProps({
      campaign: populatedCampaign.id,
      activeWinningTickets: [],
    });

    campaign.campaignProps.push(campaignProps.id);
  } else {
    campaignProps = await CampaignProps.findOne({
      campaign: populatedCampaign.id,
    })
      .select("+activeWinningTickets")
      .populate({ path: "activeWinningTickets", model: Code });
  }

  for (let i = 0; i < amountOfWinningCodes; i++) {
    (<CodeInterface[]>campaignProps.activeWinningTickets).push(codes[i]);
  }

  await campaign.save({ session });
  await campaignProps.save({ session });
}
