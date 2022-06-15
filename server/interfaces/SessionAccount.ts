import { Schema } from "mongoose";

interface SessionAccount {
  isLoggedIn: boolean;
  _id?: Schema.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  isBusinessAccount?: boolean;
}

export default SessionAccount;
