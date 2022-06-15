import { SESSION_NAME, UPLOADER_FUNCTION_URL } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import runApiLimitMiddleware from "@server/middleware/runApiLimitMiddleware";
import Account, { AccountInterface } from "@server/models/Account";
import Company, { CompanyInterface } from "@server/models/Company";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import axios from "axios";
import { NextApiResponse } from "next";

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await runApiLimitMiddleware(req, res, 3);

  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  if (req.method === "POST") {
    const { campaignId } = req.body;

    const account: AccountInterface = await Account.findById(
      req.session.get(SESSION_NAME)._id,
    ).populate({ path: "company", model: Company });

    // Checking if the provided campaign belongs to the user
    if ((<CompanyInterface>account.company).campaigns.includes(campaignId)) {
      try {
        const resp = await axios({
          method: "POST",
          url: UPLOADER_FUNCTION_URL,
          data: {
            campaignId,
          },
        });

        console.log(resp);

        return res.status(200).json({ message: "Codes will be exported." });
      } catch (err) {
        console.error("Error when requesting code export: ", err);
        return res
          .status(500)
          .json({ message: "Failed to export codes, please try again." });
      }
    } else {
      return res.status(400).json({ message: "Unknown campaign." });
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
