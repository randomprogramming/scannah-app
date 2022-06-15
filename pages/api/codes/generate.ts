import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import Account, { AccountInterface } from "@server/models/Account";
import { generateCodes } from "@server/services/CodeService";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  if (req.method === "POST") {
    const { amount, campaignId, amountOfWinningCodes, pointRewardAmount } =
      req.body;

    let amountNum: number;
    let amountOfWinningCodesNum: number;
    let pointRewardAmountNum: number;

    if (typeof amount === "string") {
      try {
        amountNum = parseInt(amount);
        amountOfWinningCodesNum = parseInt(amountOfWinningCodes);
        pointRewardAmountNum = parseInt(pointRewardAmount);

        if (
          amountNum <= 0 ||
          amountOfWinningCodesNum <= 0 ||
          pointRewardAmountNum <= 0
        ) {
          throw "Expecting a positive integer.";
        }
      } catch (err) {
        console.error("Error when trying to generate codes: ", err);

        return res.status(400).json({ message: "Bad parameters." });
      }
    } else if (
      typeof amount === "number" &&
      typeof amountOfWinningCodes === "number" &&
      typeof pointRewardAmount === "number"
    ) {
      amountNum = amount;
      amountOfWinningCodesNum = amountOfWinningCodes;
      pointRewardAmountNum = pointRewardAmount;
    } else {
      return res.status(400).json({ message: "Bad parameters." });
    }

    if (amountNum < amountOfWinningCodes) {
      return res.status(400).json({
        message:
          "Amount of generated codes must be greater than amount of winning codes.",
      });
    }

    const account: AccountInterface = await Account.findById(
      req.session.get(SESSION_NAME)._id,
    );

    try {
      await generateCodes(
        amountNum,
        account,
        campaignId,
        amountOfWinningCodesNum,
        pointRewardAmountNum,
      );
    } catch (err) {
      console.error("Error when trying to generate codes: ", err);
      return res
        .status(500)
        .json({ message: "Error when trying to generate codes." });
    }

    return res.status(200).json({ message: "Generated codes" });
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
