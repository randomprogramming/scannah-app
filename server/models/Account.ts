import mongoose, { Schema, Document, model } from "mongoose";
import bcrypt from "bcryptjs";
import { CompanyInterface } from "./Company";

export interface AccountBaseInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarURL: string;

  isBusinessAccount: boolean;
  company?: Schema.Types.ObjectId | CompanyInterface;
}

export interface AccountInterface extends AccountBaseInterface, Document {
  nameWithHiddenLastName: string;
  url: string;
}

export const accountSchema = new Schema<AccountInterface>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  avatarURL: {
    type: String,
    default: "",
  },

  isBusinessAccount: {
    type: Boolean,
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
});

accountSchema.virtual("nameWithHiddenLastName").get(function (): string {
  const firstName: string = this.firstName;
  const lastName: string = this.lastName;

  return `${firstName} ${lastName.slice(0, 1)}.`;
});

accountSchema.pre<AccountInterface>("save", function (next) {
  // Can't use this. inside a function so we have to use account like this
  const account = this;

  // If the password was not modified, no need to bcrypt it again
  if (!account.isModified("password")) {
    return next();
  }

  bcrypt.hash(account.password, 10, function (err: any, hash: string) {
    if (err) {
      return next(err);
    }
    account.password = hash;
    return next();
  });
});

accountSchema.virtual("url").get(function () {
  return `${process.env.NEXT_PUBLIC_PAGE_DOMAIN}/account/${this.id}`;
});

export default mongoose.models.Account ||
  model<AccountInterface>("Account", accountSchema);
