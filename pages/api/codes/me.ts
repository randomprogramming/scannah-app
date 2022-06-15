import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import Account, { AccountInterface } from "@server/models/Account";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";
import QRCode from "qrcode";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  if (req.method === "GET") {
    const account: AccountInterface = await Account.findById(
      req.session.get(SESSION_NAME)._id,
    );

    const qr = await QRCode.toString(account.url, { type: "svg" });

    res.send(qr);
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
