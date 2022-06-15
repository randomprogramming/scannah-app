import { NextApiRequest } from "next";
import SessionAccount from "./SessionAccount";

export interface WithSessionRequest extends NextApiRequest {
  session: {
    get(sessionName: string): SessionAccount;
    set(sessionName: string, object: SessionAccount): void;
    destroy(): void;
  };
}
