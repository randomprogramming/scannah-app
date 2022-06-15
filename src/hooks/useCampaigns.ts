import { useEffect } from "react";
import { CampaignBaseInterface } from "@server/models/Campaign";
import { Schema } from "mongoose";
import getAllDataFetcher from "src/fetchers/getAllDataFetcher";
import useSWR from "swr";
import { CAMPAIGN_ID_URL, CAMPAIGN_URL } from "@definitions/apiEndpoints";

interface CampaignWithIdInterface extends CampaignBaseInterface {
  _id: Schema.Types.ObjectId;
  winningEntriesCount: number;
  redeemedEntriesCount: number;
}

interface BaseResponse {
  isLoading: boolean;
  isError: any;
}

interface UseCampaignInterface extends BaseResponse {
  campaign: CampaignWithIdInterface;
}

interface UseCampaignsInterface extends BaseResponse {
  campaigns: CampaignWithIdInterface[];
}

export function useCampaign(_id: string): UseCampaignInterface {
  const { data, error } = useSWR(
    _id != undefined ? CAMPAIGN_ID_URL(_id) : null,
    getAllDataFetcher,
    {
      refreshInterval: 5000,
    },
  );

  useEffect(() => {
    if (error) {
      console.error("Error when fetching campaign: ", error);
    }
  }, [error]);

  return {
    campaign: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function useCampaigns(): UseCampaignsInterface {
  const { data, error } = useSWR(CAMPAIGN_URL, getAllDataFetcher);

  useEffect(() => {
    if (error) {
      console.error("Error when fetching campaigns: ", error);
    }
  }, [error]);

  return {
    campaigns: data,
    isLoading: !error && !data,
    isError: error,
  };
}
