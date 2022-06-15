// Some api endpoints don't need constant refreshing,
// so there's no point in using useSWR. They would also have no
// use of a reducer, so we those api calls here
// These actions may *NOT* be dispatched in the store, they don't have a reducer.

import {
  CAMPAIGN_ID_URL,
  CAMPAIGN_PARTICIPATION_URL,
  EXPORT_CODES_URL,
  GENERATE_CODES_URL,
  GIVEAWAY_WINNER_DRAWS_URL,
  MY_QRCODE_URL,
  REDEEM_PARTICIPATION_URL,
} from "@definitions/apiEndpoints";
import { CAMPAIGN_TYPES_ENUM } from "@server/constants";
import { CampaignPropsInterface } from "@server/models/CampaignProps";
import axios from "axios";
import { mutate } from "swr";

export async function exportCodes(campaignId: string): Promise<boolean> {
  try {
    await axios({
      url: EXPORT_CODES_URL,
      method: "POST",
      data: {
        campaignId,
      },
    });

    return true;
  } catch (err) {
    console.error("There was an error when exporting codes: ", err);
    return false;
  }
}

export async function generateCodes(
  amount: string,
  campaignId: string,
  amountOfWinningCodes: string,
  pointRewardAmount: string,
): Promise<boolean> {
  try {
    await axios({
      url: GENERATE_CODES_URL,
      method: "POST",
      data: {
        amount,
        campaignId,
        amountOfWinningCodes,
        pointRewardAmount,
      },
    });

    // tell useSWR to refresh all content which comes from this api endpoint
    mutate(CAMPAIGN_ID_URL(campaignId));
    return true;
  } catch (err) {
    console.error("There was an error when generating codes: ", err);
    return false;
  }
}

// Returns an SVG in text format
export async function getMyQRCode(): Promise<string> {
  try {
    const response = await axios({
      url: MY_QRCODE_URL,
      method: "GET",
    });

    return response.data;
  } catch (err) {
    console.error("There was an error when fetching my QR Code: ", err);
    return "";
  }
}

interface CampaignParticipationData {
  campaignParticipation: CampaignPropsInterface[];
  accountName: string;
}

export async function getCampaignParticipation(
  participantAccountId: string,
): Promise<CampaignParticipationData> {
  try {
    const response = await axios({
      url: CAMPAIGN_PARTICIPATION_URL(participantAccountId),
      method: "GET",
    });

    const data: CampaignParticipationData = response.data;

    return data;
  } catch (err) {
    console.error("Error when fetching campaign participation: ", err);
  }
}

export async function redeemParticipation(
  campaignType: CAMPAIGN_TYPES_ENUM,
  campaignPropsId: string,
  participantAccountId: string,
  amountOfPoints?: string,
): Promise<Boolean> {
  switch (campaignType) {
    case CAMPAIGN_TYPES_ENUM.giveaway:
      const responseGiveaway = await axios({
        url: REDEEM_PARTICIPATION_URL,
        method: "POST",
        data: {
          participantAccountId,
          campaignPropsId,
        },
      });
      return responseGiveaway.status < 400;
    case CAMPAIGN_TYPES_ENUM.luckyTicket:
      const responseLuckyTicket = await axios({
        url: REDEEM_PARTICIPATION_URL,
        method: "POST",
        data: {
          participantAccountId,
          campaignPropsId,
        },
      });
      return responseLuckyTicket.status < 400;
    case CAMPAIGN_TYPES_ENUM.pointCollector:
      const responsePointCollector = await axios({
        url: REDEEM_PARTICIPATION_URL,
        method: "POST",
        data: {
          participantAccountId,
          campaignPropsId,
          amountOfPoints,
        },
      });
      return responsePointCollector.status < 400;
  }
}

export async function deactivateCampaign(campaignId: string) {
  try {
    const url = CAMPAIGN_ID_URL(campaignId);

    await axios({
      method: "PATCH",
      url,
      data: {
        isActive: false,
      },
    });
    mutate(url);

    return true;
  } catch (err) {
    console.error("Error when deactivating campaign: ", err);
    return false;
  }
}

export async function drawGiveawayWinners(
  campaignId: string,
  numberOfDraws: string,
  deactivateCampaignAfterDraw: boolean,
) {
  await axios({
    method: "POST",
    url: GIVEAWAY_WINNER_DRAWS_URL,
    data: {
      campaignId: campaignId,
      numberOfDraws,
      deactivateCampaignAfterDraw,
    },
  });
}
