import mongoose, { Schema, Document, model } from "mongoose";
import { AccountInterface } from "./Account";
import { CampaignInterface } from "./Campaign";
import { CodeInterface } from "./Code";

interface ICommon extends Document {
  campaign: Schema.Types.ObjectId | CampaignInterface;
}

export interface GiveawayCampaignProps extends ICommon {
  account: Schema.Types.ObjectId | AccountInterface;
  giveawayEntries: number;
  isRedeemed: boolean;
  isWinner: boolean;
  redeemDate: Date | null;
}

export interface ILuckyTicketWinningTicket {
  winningAccount: Schema.Types.ObjectId | AccountInterface;
  winningCode: Schema.Types.ObjectId | CodeInterface;
  isRedeemed: boolean;
  redeemDate: Date | null;
}

// Campaign will only have one CampaignProps relationship in this case.
// When a winning ticket is scanned, it gets removed from the
// winningTickets arr, and it gets put into the redeemedTickets arr
// and the person that scanned the winning ticket gets
// added to the winningAccounts array.
export interface LuckyTicketCampaignProps extends ICommon {
  activeWinningTickets: Schema.Types.ObjectId[] | CodeInterface[];
  scannedWinningTickets: ILuckyTicketWinningTicket[];
  amountOfActiveWinningTickets: number;
  amountOfScannedWinningTickets: number;
  checkIsWinningCode(codeId: Schema.Types.ObjectId): boolean;
}

export interface PointCollectorCampaignProps extends ICommon {
  account: Schema.Types.ObjectId | AccountInterface;
  collectedPoints: number;
}

export type CampaignPropsInterface =
  | GiveawayCampaignProps
  | LuckyTicketCampaignProps
  | PointCollectorCampaignProps;

const campaignProps = new Schema<CampaignPropsInterface>({
  // common
  campaign: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  // giveaway and point collector
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  // lucky ticket
  activeWinningTickets: [
    {
      type: String,
      ref: "Code",
      select: false,
    },
  ],
  // lucky ticket
  scannedWinningTickets: [
    {
      winningAccount: {
        type: Schema.Types.ObjectId,
        ref: "Account",
      },
      winningCode: {
        type: String,
        ref: "Code",
      },
      isRedeemed: {
        type: Boolean,
        default: false,
      },
      redeemDate: {
        type: Date,
      },
    },
  ],
  // lucky ticket
  amountOfActiveWinningTickets: {
    type: Number,
    default: 0,
  },
  // lucky ticket
  amountOfScannedWinningTickets: {
    type: Number,
    default: 0,
  },
  // giveaway
  giveawayEntries: {
    type: Number,
    default: 0,
  },
  // giveaway
  isRedeemed: {
    type: Boolean,
    default: false,
  },
  // giveaway
  redeemDate: {
    type: Date,
  },
  // giveaway
  isWinner: {
    type: Boolean,
    default: false,
  },
  //point collector
  collectedPoints: {
    type: Number,
    default: 0,
  },
});

campaignProps.pre<CampaignPropsInterface>("save", async function (next) {
  if (
    this.isModified("activeWinningTickets") ||
    this.isModified("scannedWinningTickets")
  ) {
    const thisInterfaced = <LuckyTicketCampaignProps>this;

    if (
      !thisInterfaced.activeWinningTickets ||
      !thisInterfaced.scannedWinningTickets
    ) {
      throw "Error when trying to save campaign props.";
    }

    thisInterfaced.amountOfActiveWinningTickets =
      thisInterfaced.activeWinningTickets.length;

    thisInterfaced.amountOfScannedWinningTickets =
      thisInterfaced.scannedWinningTickets.length;
  }

  next();
});

campaignProps.method(
  "checkIsWinningCode",
  function (codeId: Schema.Types.ObjectId): boolean {
    if (this.isSelected("activeWinningTickets")) {
      const thisInterfaced = <LuckyTicketCampaignProps>this;

      const isInActiveWinningTickets = (<Schema.Types.ObjectId[]>(
        thisInterfaced.activeWinningTickets
      )).includes(codeId);

      let isInScannedWinningTickets = false;

      for (const scannedTicket of thisInterfaced.scannedWinningTickets) {
        if (scannedTicket.winningCode === codeId) {
          isInScannedWinningTickets = true;
          break;
        }
      }

      return isInActiveWinningTickets || isInScannedWinningTickets;
    }

    return false;
  },
);

export default mongoose.models.CampaignProps ||
  model<CampaignPropsInterface>("CampaignProps", campaignProps);
