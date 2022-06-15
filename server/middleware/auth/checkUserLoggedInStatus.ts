import { SESSION_NAME } from "@server/constants";
import { WithSessionRequest } from "@server/interfaces/handlerParams";

export default function (
  req: WithSessionRequest,
  shouldBeBusinessAccount?: boolean,
) {
  if (
    !req.session.get(SESSION_NAME) ||
    !req.session.get(SESSION_NAME).isLoggedIn
  ) {
    throw "Please log in.";
  }

  if (
    shouldBeBusinessAccount &&
    !req.session.get(SESSION_NAME).isBusinessAccount
  ) {
    throw "You will need a business account for this feature.";
  }
}
