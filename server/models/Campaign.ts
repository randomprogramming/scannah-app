import mongoose, { Document, Schema, model } from "mongoose";
import { CampaignTypeInterface } from "./CampaignType";
import { CodeInterface } from "./Code";
import { CompanyInterface } from "./Company";
import { CampaignPropsInterface } from "./CampaignProps";
import { DownloadLinkInterface } from "./DownloadLink";

export interface CampaignBaseInterface {
  name: string;
  isActive: boolean;
  isExportingCodes: boolean;
  campaignType: Schema.Types.ObjectId | CampaignTypeInterface;
  company: Schema.Types.ObjectId | CompanyInterface;
  codes: Schema.Types.ObjectId[] | CodeInterface[];
  campaignProps: Schema.Types.ObjectId[] | CampaignPropsInterface[];
  totalNumberOfCodes: number;
  numberOfActiveCodes: number;
  numberOfScannedCodes: number;
  downloadLink: Schema.Types.ObjectId | DownloadLinkInterface;
  allowsMultipleEntries: boolean;

  // This property must be manually calculated and injected, so it's
  // going to be null most of the time
  // Can't be a virtual since we need to access the database to calculate it
  numberOfUniquePeopleReached?: number;
}

export interface CampaignInterface extends CampaignBaseInterface, Document {}

const campaignSchema = new Schema<CampaignInterface>({
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isExportingCodes: {
    type: Boolean,
    default: false,
  },
  totalNumberOfCodes: {
    type: Number,
    default: 0,
  },
  numberOfActiveCodes: {
    type: Number,
    default: 0,
  },
  numberOfScannedCodes: {
    type: Number,
    default: 0,
  },

  // giveaway campaign type
  allowsMultipleEntries: {
    type: Boolean,
    default: true,
  },
  campaignType: {
    type: Schema.Types.ObjectId,
    ref: "CampaignType",
    required: true,
  },
  campaignProps: [
    {
      type: Schema.Types.ObjectId,
      ref: "CampaignProps",
    },
  ],
  codes: [
    {
      type: String,
      ref: "Code",
      select: false, // hide all codes from the users
    },
  ],
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  downloadLink: {
    type: Schema.Types.ObjectId,
    ref: "DownloadLink",
  },
});

export default mongoose.models.Campaign ||
  model<CampaignInterface>("Campaign", campaignSchema);
