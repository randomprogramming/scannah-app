import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import db from "@server/utils/db";
import markCodeAsScanned from "@server/utils/markCodeAsScanned";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";
import runApiLimitMiddleware from "@server/middleware/runApiLimitMiddleware";
import ScannedOwnCodeError from "@server/throwables/ScannedOwnCodeError";

function handleReturn(
  res: NextApiResponse,
  statusCode: number,
  message: string,
) {
  const page = "/code/scanned";

  return res.redirect(`${page}?code=${statusCode}&message=${message}`);
}

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await runApiLimitMiddleware(req, res);

  await db();

  try {
    checkUserLoggedInStatus(req);
  } catch (err) {
    return res.redirect("/sign-in?redirect=" + req.url);
  }

  if (req.method === "GET") {
    const { slug } = req.query;

    const companyId = slug[0];
    const campaignId = slug[1];
    const codeId = slug[2];

    if (companyId.length > 0 && campaignId.length > 0 && codeId.length > 0) {
      try {
        let returnMessage = await markCodeAsScanned(
          codeId,
          campaignId,
          req.session.get(SESSION_NAME)._id,
          companyId,
        );

        if (!returnMessage || returnMessage.length === 0) {
          returnMessage = "Code scanned.";
        }

        return handleReturn(res, 200, returnMessage);
      } catch (err) {
        if (err instanceof ScannedOwnCodeError) {
          // If the user scans their own code
          return res.redirect("/code/" + codeId);
        } else {
          console.error("Error when scanning code: ", err);
          return handleReturn(res, 500, err);
        }
      }
    } else {
      return res.status(400).json({ message: "Unknown parameters." });
    }
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
