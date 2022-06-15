import QRCodeOptions, {
  QR_CODE_OPTIONS_DEFAULTS,
} from "@server/interfaces/qrCodeOptions";
import mongoose, { Document, Schema, model } from "mongoose";
import { AccountInterface } from "./Account";
import { CampaignInterface } from "./Campaign";

export interface CompanyBaseInterface {
  name: string;
  website?: string;
  logoURL: string;

  accounts: AccountInterface[] | Schema.Types.ObjectId[];
  campaigns: CampaignInterface[] | Schema.Types.ObjectId[];

  qrCodeOptions: QRCodeOptions;
}

export interface CompanyInterface extends CompanyBaseInterface, Document {}

const companySchema = new Schema<CompanyInterface>({
  name: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  logoURL: {
    type: String,
    default: "",
  },

  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  campaigns: [
    {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
    },
  ],

  qrCodeOptions: {
    margin: {
      type: Number,
      default: QR_CODE_OPTIONS_DEFAULTS.margin,
    },
    image: {
      type: String,
      default: QR_CODE_OPTIONS_DEFAULTS.image,
    },
    imageOptions: {
      hideBackgroundDots: {
        type: Boolean,
        default: QR_CODE_OPTIONS_DEFAULTS.imageOptions.hideBackgroundDots,
      },
      imageSize: {
        type: Number,
        default: QR_CODE_OPTIONS_DEFAULTS.imageOptions.imageSize,
      },
      margin: {
        type: Number,
        default: QR_CODE_OPTIONS_DEFAULTS.imageOptions.margin,
      },
      crossOrigin: {
        type: String,
        default: QR_CODE_OPTIONS_DEFAULTS.imageOptions.crossOrigin,
      },
    },
    dotsOptions: {
      type: {
        type: String,
        default: QR_CODE_OPTIONS_DEFAULTS.dotsOptions.type,
      },
      color: {
        type: String,
        default: QR_CODE_OPTIONS_DEFAULTS.dotsOptions.color,
      },
    },
    backgroundOptions: {
      color: {
        type: String,
        default: QR_CODE_OPTIONS_DEFAULTS.backgroundOptions.color,
      },
    },
    cornersSquareOptions: {
      type: {
        type: String,
        default: QR_CODE_OPTIONS_DEFAULTS.cornersSquareOptions.type,
      },
      color: {
        type: String,
        default: QR_CODE_OPTIONS_DEFAULTS.cornersSquareOptions.color,
      },
    },
    cornersDotOptions: {
      type: {
        type: String,
        default: QR_CODE_OPTIONS_DEFAULTS.cornersDotOptions.type,
      },
      color: {
        type: String,
        default: QR_CODE_OPTIONS_DEFAULTS.cornersDotOptions.color,
      },
    },
  },
});

export default mongoose.models.Company ||
  model<CompanyInterface>("Company", companySchema);
