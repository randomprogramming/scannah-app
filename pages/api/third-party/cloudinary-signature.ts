import { WithSessionRequest } from "@server/interfaces/handlerParams";
import checkUserLoggedInStatus from "@server/middleware/auth/checkUserLoggedInStatus";
import db from "@server/utils/db";
import withSession from "@server/wrappers/withSession";
import { NextApiResponse } from "next";
import cloudinaryImp from "cloudinary";

const cloudinary = cloudinaryImp.v2;

async function handler(req: WithSessionRequest, res: NextApiResponse) {
  await db();

  try {
    checkUserLoggedInStatus(req, true);
  } catch (err) {
    return res.status(401).json({ message: err });
  }

  if (req.method === "GET") {
    let timestamp = Math.round(new Date().getTime() / 1000);

    // Sign the timestamp and return the signature with the timestamp
    // This allows the front end to upload an image without having to pass it
    // through the back end and created unnecessary delays
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
      },
      process.env.CLOUDINARY_API_SECRET,
    );

    return res.send({
      signature,
      timestamp,
    });
  } else {
    return res.status(404).json({ message: "Unknown HTTP method." });
  }
}

export default withSession(handler);
