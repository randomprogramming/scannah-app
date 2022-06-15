import { AccountInterface } from "@server/models/Account";
import Campaign, { CampaignInterface } from "@server/models/Campaign";
import CampaignType, {
  CampaignTypeInterface,
} from "@server/models/CampaignType";
import Company, { CompanyInterface } from "@server/models/Company";
import { Schema } from "mongoose";
import Account from "@server/models/Account";
import CampaignProps, {
  CampaignPropsInterface,
  GiveawayCampaignProps,
} from "@server/models/CampaignProps";
import { CAMPAIGN_TYPES_ENUM } from "@server/constants";

// make a regex for campaign name so that it only can be valid alphabet characters
export async function createCampaign(
  campaignName: string,
  company: CompanyInterface,
  campaignTypeId: string,
  allowsMultipleEntries?: boolean,
): Promise<Schema.Types.ObjectId | null> {
  if (typeof campaignName !== "string" || campaignName.length <= 0) {
    return null;
  }

  const campaign: CampaignInterface = new Campaign({
    name: campaignName,
    company: company._id,
    campaignType: campaignTypeId,
    allowsMultipleEntries,
  });

  const session = await Campaign.startSession();

  // Try to save the campaign, campaignProps and company in one transaction
  // If one save fails, nothing may be saved to the database
  try {
    session.startTransaction();

    await campaign.save({ session });

    company.campaigns.push(campaign._id);
    await company.save({ session });

    await session.commitTransaction();
    session.endSession();

    return campaign._id;
  } catch (err) {
    console.error("Error when creating campaign: ", err);
    return null;
  }
}

function shuffleArray(array: string[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function prepareGiveawayEntries(
  campaignProps: GiveawayCampaignProps[],
): string[] {
  let entries = [];

  campaignProps.forEach((props) => {
    for (let i = 0; i < props.giveawayEntries; i++) {
      entries.push(props.id);
    }
  });

  shuffleArray(entries);

  return entries;
}

function getRandomInt(max: number): number {
  // Can NOT return the max passed in param
  // So a max param of 4 can return: 0, 1, 2, 3
  return Math.floor(Math.random() * max);
}

export async function drawGiveawayWinners(
  campaignId: string,
  accountId: Schema.Types.ObjectId,
  numberOfDraws: number,
  deactivateCampaignAfterDraw: boolean,
) {
  const campaign: CampaignInterface = await Campaign.findById(
    campaignId,
  ).populate({
    path: "campaignType",
    model: CampaignType,
  });

  const campaignProps: CampaignPropsInterface[] = await CampaignProps.find({
    campaign: campaign.id,
    isRedeemed: false,
    isWinner: false,
  });

  const account: AccountInterface = await Account.findById(accountId).populate({
    path: "company",
    model: Company,
  });

  if (!campaign.isActive) {
    throw "That campaign is no longer active.";
  }

  if (!(<CompanyInterface>account.company).campaigns.includes(campaign.id)) {
    throw "You do not have access to that campaign.";
  }

  if (
    (<CampaignTypeInterface>campaign.campaignType).title !==
    CAMPAIGN_TYPES_ENUM.giveaway
  ) {
    throw "Invalid campaign type.";
  }

  let giveawayEntriesPropsId = prepareGiveawayEntries(
    campaignProps as GiveawayCampaignProps[],
  );

  if (giveawayEntriesPropsId.length < numberOfDraws) {
    throw (
      "There are not enough giveaway entries for " +
      numberOfDraws +
      " draws. Please enter a smaller number."
    );
  }

  let winners = [];

  for (let i = 0; i < numberOfDraws; i++) {
    let winner = getRandomInt(giveawayEntriesPropsId.length);

    winners.push(giveawayEntriesPropsId[winner]);
  }

  const winningProps = <GiveawayCampaignProps[]>(
    campaignProps.filter((props) => winners.includes(props.id))
  );

  winningProps.forEach((winningProp) => (winningProp.isWinner = true));

  campaign.isActive = !deactivateCampaignAfterDraw;

  const session = await CampaignProps.startSession();
  session.startTransaction();

  try {
    await CampaignProps.updateMany(
      {
        _id: winners,
        campaign: campaign.id,
        isRedeemed: false,
        isWinner: false,
      },
      {
        $set: {
          isWinner: true,
        },
      },
      {
        session,
      },
    );
    await campaign.save({ session });

    await session.commitTransaction();
  } catch (err) {
    console.error(err);
    throw "Failed to draw winners, please try again.";
  } finally {
    session.endSession();
  }
}
