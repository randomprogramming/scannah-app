import { CAMPAIGN_SCANS_URL } from "@definitions/apiEndpoints";
import useSWR from "swr";
import getCampaignCodesFetcher from "src/fetchers/getCampaignCodesFetcher";
import { CampaignScansInterface } from "pages/api/campaigns/scans";

interface UseCampaignScansInterface {
  campaignScans: CampaignScansInterface[];
  isLoading: boolean;
  isError: any;
}

export default function useCampaignScans(
  campaignId: string,
): UseCampaignScansInterface {
  const { data, error } = useSWR(
    campaignId != undefined ? [CAMPAIGN_SCANS_URL, campaignId] : null,
    getCampaignCodesFetcher,
  );

  return {
    campaignScans: data,
    isLoading: !error && !data,
    isError: error,
  };
}
