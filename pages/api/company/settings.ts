import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import {
  getCompanySettings,
  setCompanySettings,
} from "@server/services/CompanyService";
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

  const sessionAccountId = req.session.get(SESSION_NAME)._id;

  if (req.method === "GET") {
    try {
      const company = await getCompanySettings(sessionAccountId);

      res.status(200).send(company);
    } catch (err) {
      console.error("Error when fetching account settings: ", err);
      res.status(500).json({ message: err });
    }
  } else if (req.method === "POST") {
    const { name, website, logoURL } = req.body;

    try {
      if (await setCompanySettings(sessionAccountId, name, website, logoURL)) {
        return res
          .status(200)
          .json({ message: "Company information updated." });
      } else {
        return res.status(400).json({ message: "Failed to update company." });
      }
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
