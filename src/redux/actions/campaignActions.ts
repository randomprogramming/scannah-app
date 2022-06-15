import { CAMPAIGN_TYPES_URL, CAMPAIGN_URL } from "@definitions/apiEndpoints";
import { RootState } from "@redux/reducers";
import axios from "axios";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  setCampaignTypes,
  CampaignTypeBaseInterfaceWithId,
  setIsCreatingCampaign,
  setErrorWhenCreatingCampaign,
  setMessageOnCreatedCampaign,
} from "@redux/slices/campaignSlice";

export function createCampaign(
  onNewCampaignCreate?: (newCampaignId: string) => void,
) {
  return async (
    dispatch: ThunkDispatch<RootState, void, Action>,
    getState: () => RootState,
  ) => {
    const { name, selectedCampaignTypeId, giveawayAllowsMultipleEntries } =
      getState().campaign;

    dispatch(setIsCreatingCampaign(true));

    try {
      const response = await axios({
        url: CAMPAIGN_URL,
        method: "POST",
        data: {
          name,
          campaignTypeId: selectedCampaignTypeId,
          allowsMultipleEntries: giveawayAllowsMultipleEntries,
        },
      });
      dispatch(setErrorWhenCreatingCampaign(false));
      dispatch(setMessageOnCreatedCampaign("Campaign created!"));
      if (onNewCampaignCreate) {
        onNewCampaignCreate(response.data);
      }
    } catch (err) {
      dispatch(setErrorWhenCreatingCampaign(true));
      dispatch(
        setMessageOnCreatedCampaign(
          "Error when creating campaign, please try again.",
        ),
      );
      console.error("Error when creating campaign: ", err);
    }

    dispatch(setIsCreatingCampaign(false));
  };
}

export function fetchCampaignTypes() {
  return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
    try {
      const response = await axios({
        url: CAMPAIGN_TYPES_URL,
        method: "GET",
      });

      const campaignTypes = <CampaignTypeBaseInterfaceWithId[]>response.data;

      if (campaignTypes.length > 0) {
        dispatch(setCampaignTypes(campaignTypes));
      } else {
        console.error("There were no Campaign types returned");
      }
    } catch (err) {
      console.error("Error when fetching Campaign types: ", err);
    }
  };
}
