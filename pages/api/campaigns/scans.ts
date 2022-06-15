import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import Account, { AccountInterface } from "@server/models/Account";
import Code, { CodeInterface } from "@server/models/Code";
import { CompanyInterface } from "@server/models/Company";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";

export interface CampaignScansInterface {
  scannedBy: string;
  dateScanned: Date;
}

// Returns info about users that scanned the requested campaigns codes
async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  const { campaignId } = req.body;

  if (req.method === "POST" && campaignId) {
    const account: AccountInterface = await Account.findById(
      req.session.get(SESSION_NAME)._id,
    ).populate("company");

    if ((<CompanyInterface>account.company).campaigns.includes(campaignId)) {
      const scannedCodes: CodeInterface[] = await Code.find({
        campaign: campaignId,
        isScanned: true,
      })
        .select("scannedBy dateScanned")
        .populate({ path: "scannedBy", model: Account })
        .sort({ dateScanned: "desc" })
        .limit(100); //TODO: Paginate instead of limiting

      return res.status(200).json(
        scannedCodes.map((code) => {
          return {
            scannedBy: (<AccountInterface>code.scannedBy)
              .nameWithHiddenLastName,
            dateScanned: code.dateScanned,
          };
        }),
      );
    } else {
      return res.status(400).json({ message: "Unknown campaign ID provided." });
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
