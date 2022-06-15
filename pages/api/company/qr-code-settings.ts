import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";
import Account, { AccountInterface } from "@server/models/Account";
import Company, { CompanyInterface } from "@server/models/Company";
import QRCodeOptions, {
  isQrCodeOptions,
} from "@server/interfaces/qrCodeOptions";
import {
  resetCompanyQrCodeSettings,
  setCompanyQrCodeSettings,
} from "@server/services/CompanyService";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  const sessionAccountId = req.session.get(SESSION_NAME)._id;

  if (req.method === "GET") {
    const account: AccountInterface = await Account.findById(
      sessionAccountId,
    ).populate({
      path: "company",
      model: Company,
    });

    if (account) {
      return res.status(200).send({
        qrCodeOptions: (<CompanyInterface>account.company).qrCodeOptions,
        logoURL: (<CompanyInterface>account.company).logoURL,
      });
    } else {
      return res.status(400).json({ message: "Unknown account." });
    }
  } else if (req.method === "POST") {
    if (isQrCodeOptions(req.body)) {
      if (
        await setCompanyQrCodeSettings(
          sessionAccountId,
          req.body as QRCodeOptions,
        )
      ) {
        return res.status(200).json({ message: "QR Code updated." });
      }

      return res.status(500).json({ message: "Failed to update QR Code." });
    } else {
      return res.status(400).json({ message: "Invalid request body." });
    }
  } else if (req.method === "DELETE") {
    // Delete will reset all the options to defaults
    // It's a bit misused but it's better than creating a new endpoint
    // for a single use
    if (await resetCompanyQrCodeSettings(sessionAccountId)) {
      return res.status(200).json({ message: "QR Code reset." });
    } else {
      return res.status(500).json({ message: "Failed to reset QR Code." });
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
