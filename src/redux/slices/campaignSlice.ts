import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CampaignTypeBaseInterface } from "@server/models/CampaignType";

export interface CampaignTypeBaseInterfaceWithId
  extends CampaignTypeBaseInterface {
  _id: string;
}

interface CampaignSliceInterface {
  name: string;
  giveawayAllowsMultipleEntries: boolean;
  campaignTypes: CampaignTypeBaseInterfaceWithId[];
  selectedCampaignTypeId: string;
  isCreatingCampaign: boolean;
  errorWhenCreatingCampaign: boolean;
  messageOnCreatedCampaign: string;
}

const initialState: CampaignSliceInterface = {
  name: "",
  giveawayAllowsMultipleEntries: true,
  campaignTypes: [],
  selectedCampaignTypeId: "",
  isCreatingCampaign: false,
  errorWhenCreatingCampaign: false,
  messageOnCreatedCampaign: "",
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setCampaignTypes: (
      state,
      action: PayloadAction<CampaignTypeBaseInterfaceWithId[]>,
    ) => {
      state.campaignTypes = action.payload;
    },
    setAllowMultipleEntries: (state, action: PayloadAction<boolean>) => {
      state.giveawayAllowsMultipleEntries = action.payload;
    },
    setSelectedCampaignTypeId: (state, action: PayloadAction<string>) => {
      state.selectedCampaignTypeId = action.payload;
    },
    setIsCreatingCampaign: (state, action: PayloadAction<boolean>) => {
      state.isCreatingCampaign = action.payload;
    },
    setErrorWhenCreatingCampaign: (state, action: PayloadAction<boolean>) => {
      state.errorWhenCreatingCampaign = action.payload;
    },
    setMessageOnCreatedCampaign: (state, action: PayloadAction<string>) => {
      console.log(action.payload);

      state.messageOnCreatedCampaign = action.payload;
    },
  },
});

export const {
  setName,
  setCampaignTypes,
  setAllowMultipleEntries,
  setSelectedCampaignTypeId,
  setIsCreatingCampaign,
  setErrorWhenCreatingCampaign,
  setMessageOnCreatedCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;
