import mongoose, { Document, Schema, model } from "mongoose";
import { AccountInterface } from "./Account";
import { CampaignInterface } from "./Campaign";
import { CompanyInterface } from "./Company";
import { nanoid } from "nanoid";

export interface CodeBaseInterface {
  isScanned: boolean;
  // If this code belongs to a point collector giveaway, this is how many
  // points the code will award
  points: number;

  dateScanned: Date | null;
  scannedBy: AccountInterface | Schema.Types.ObjectId | null;
  company: CompanyInterface | Schema.Types.ObjectId;
  campaign: CampaignInterface | Schema.Types.ObjectId;
}

export interface CodeInterface extends CodeBaseInterface, Document {
  _id: string;
  url: string;
}

const codeSchema = new Schema<CodeInterface>({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  isScanned: {
    type: Boolean,
    default: false,
  },
  points: {
    type: Number,
  },
  dateScanned: {
    type: Date,
  },
  scannedBy: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    select: false,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
});

codeSchema.virtual("url").get(function () {
  return `${process.env.NEXT_PUBLIC_PAGE_DOMAIN}/api/codes/scan/${this.company}/${this.campaign}/${this.id}`;
});

export default mongoose.models.Code || model<CodeInterface>("Code", codeSchema);
