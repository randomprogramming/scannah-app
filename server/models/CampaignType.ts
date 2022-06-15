import { CAMPAIGN_TYPES_ENUM } from "@server/constants";
import mongoose, { Document, Schema, model } from "mongoose";

export interface CampaignTypeBaseInterface {
  title: CAMPAIGN_TYPES_ENUM;
  description: string;
}

export interface CampaignTypeInterface
  extends CampaignTypeBaseInterface,
    Document {}

const campaignType = new Schema<CampaignTypeInterface>({
  title: {
    type: String,
    required: true,
    unique: true,
    enum: CAMPAIGN_TYPES_ENUM,
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.models.CampaignType ||
  model<CampaignTypeInterface>("CampaignType", campaignType);
