import Account, { AccountInterface } from "@server/models/Account";
import Campaign from "@server/models/Campaign";
import CampaignProps, {
  CampaignPropsInterface,
} from "@server/models/CampaignProps";
import CampaignType from "@server/models/CampaignType";
import Company, { CompanyInterface } from "@server/models/Company";
import { Schema } from "mongoose";

interface CampaignParticipationReturn {
  campaignParticipation: CampaignPropsInterface[];
  accountName: string;
}

// Find all the campaigns where the participantAccountId
// participated in the hostAccountId's campaign
export async function getCampaignParticipation(
  campaignHostAccountId: Schema.Types.ObjectId | string,
  participantAccountId: Schema.Types.ObjectId | string,
): Promise<CampaignParticipationReturn> {
  const hostAccount: AccountInterface = await Account.findById(
    campaignHostAccountId,
  ).populate({
    path: "company",
    model: Company,
  });

  const participantAccount: AccountInterface = await Account.findById(
    participantAccountId,
  );

  const hostCampaigns = <Schema.Types.ObjectId[]>(
    (<CompanyInterface>hostAccount.company).campaigns
  );

  let campaignProps: CampaignPropsInterface[] = [];

  for (const campaign of hostCampaigns) {
    const response: CampaignPropsInterface[] = await CampaignProps.find({
      campaign: campaign,
      $or: [
        { account: participantAccountId },
        { "scannedWinningTickets.winningAccount": participantAccountId },
      ],
    }).populate({
      path: "campaign",
      model: Campaign,
      populate: {
        path: "campaignType",
        model: CampaignType,
      },
    });

    campaignProps = campaignProps.concat(response);
  }

  return {
    campaignParticipation: campaignProps,
    accountName: `${participantAccount.firstName} ${participantAccount.lastName}`,
  };
}
