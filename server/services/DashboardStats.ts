import Code from "@server/models/Code";
import { Schema } from "mongoose";
import Account from "@server/models/Account";
import Company, { CompanyInterface } from "@server/models/Company";
import { ILastWeekScans } from "@server/interfaces/dashboardStats";
import mongoose from "mongoose";

// Returns scanned codes from the last 7 days
// Will NOT return all dates
// If a date had no scanned dates, it will not return a object with that date
export async function scannedCodesFromLastWeek(
  accountId: Schema.Types.ObjectId,
): Promise<ILastWeekScans[]> {
  const account = await Account.findById(accountId).populate({
    path: "company",
    model: Company,
  });

  const accountCampaigns = <Schema.Types.ObjectId[]>(
    (<CompanyInterface>account.company).campaigns
  );

  // set to the end of day
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Set to start of week
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  lastWeek.setHours(0, 0, 0, 0);

  const codes = await Code.aggregate([
    {
      $match: {
        isScanned: true,
        dateScanned: {
          $gte: lastWeek,
          $lte: today,
        },
        campaign: {
          $in: accountCampaigns,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$dateScanned" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $addFields: {
        date: "$_id",
      },
    },
  ]);

  return codes;
}

// Returns codes the user has scanned from the last 7 days
// Will NOT return all dates
// If a date had no scanned dates, it will not return a object with that date
export async function codesScannedByAccount(
  accountId: Schema.Types.ObjectId,
): Promise<ILastWeekScans[]> {
  // set to the end of day
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Set to start of week
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  lastWeek.setHours(0, 0, 0, 0);

  const codes = await Code.aggregate([
    {
      $match: {
        isScanned: true,
        scannedBy: mongoose.Types.ObjectId(accountId as unknown as string),
        dateScanned: {
          $gte: lastWeek,
          $lte: today,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$dateScanned" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $addFields: {
        date: "$_id",
      },
    },
  ]);

  return codes;
}
