import { SESSION_NAME } from "@server/constants";
import { RegisterBodyInterface } from "@server/interfaces/requestBody";
import SessionAccount from "@server/interfaces/SessionAccount";
import {
  isEmailInvalid,
  isNameInvalid,
  isPasswordInvalid,
} from "@server/middleware/auth/validateRegisterBody";
import Account, { AccountInterface } from "@server/models/Account";
import Company, { CompanyInterface } from "@server/models/Company";
import validatePassword from "@server/utils/validatePassword";
import { Schema } from "mongoose";
import { createCompany } from "./CompanyService";

export async function createAccount(
  accountBase: RegisterBodyInterface,
  isBusinessAccount: boolean,
): Promise<boolean> {
  if (await Account.exists({ email: accountBase.email })) {
    throw "Account with that email already exists.";
  }

  try {
    let account: AccountInterface = new Account({
      ...accountBase,
      isBusinessAccount,
    });

    if (isBusinessAccount) {
      const companyId = await createCompany(
        account.id,
        accountBase.companyName,
        accountBase.companyWebsite,
      );

      if (companyId) {
        account.company = companyId;
      } else {
        return false;
      }
    }

    await account.save();
    return true;
  } catch (err) {
    console.error("Error when creating account: ", err);
    return false;
  }
}

export async function loginAccount(
  req: any,
  email: string,
  password: string,
): Promise<void> {
  const incorrectEmailPasswordMessage =
    "Incorrect email or password, please try again.";

  const account: AccountInterface | null = await Account.findOne({
    email: email,
  }).select("+password");

  if (!account) throw incorrectEmailPasswordMessage;

  // we use iron-session dependency which
  // sets a cookie in the browser after using the set function
  // The cookie also holds some encrypted data like firstName, lastName etc.
  if (validatePassword(password, account.password)) {
    const sessionAccount: SessionAccount = {
      isLoggedIn: true,
      _id: account._id,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      isBusinessAccount: account.isBusinessAccount,
    };

    req.session.set(SESSION_NAME, sessionAccount);

    await req.session.save();
    return;
  } else {
    throw incorrectEmailPasswordMessage;
  }
}

export async function getAccountCompany(
  accountId: Schema.Types.ObjectId,
  select?: string,
): Promise<CompanyInterface | null> {
  const account: AccountInterface = await Account.findById(accountId).populate({
    path: "company",
    model: Company,
    select,
  });

  if (account && account.isBusinessAccount) {
    return <CompanyInterface>account.company;
  }

  return null;
}

export async function getAccountSettings(accountId: Schema.Types.ObjectId) {
  const account: AccountInterface = await Account.findOne({
    _id: accountId,
  }).select("firstName lastName email avatarURL");

  if (!account) {
    throw "Account not found.";
  }

  return account;
}

export async function setAccountSettings(
  accountId: Schema.Types.ObjectId,
  firstName: any,
  lastName: any,
  email: any,
  password: any,
  repeatedPassword: any,
  avatarURL: any,
): Promise<boolean> {
  const account: AccountInterface = await Account.findOne({
    _id: accountId,
  }).select("+password");

  if (isNameInvalid(firstName)) {
    throw "Invalid first name.";
  }

  account.firstName = firstName;

  if (isNameInvalid(lastName)) {
    throw "Invalid last name.";
  }

  account.lastName = lastName;

  if (isEmailInvalid(email)) {
    throw "Invalid email.";
  }

  account.email = email;

  if (!isPasswordInvalid(password)) {
    if (typeof repeatedPassword === "string" && repeatedPassword === password) {
      account.password = password;
    } else {
      throw "Entered password don't match.";
    }
  }

  if (
    typeof password === "string" &&
    isPasswordInvalid(password) &&
    password.length > 0
  ) {
    // if the password is present, but it's not validated(maybe it's too short):
    // throw an error
    // otherwise, the password field is probably empty and in that case
    // the function should pass without throwing
    throw "Invalid password.";
  }

  if (typeof avatarURL === "string") {
    account.avatarURL = avatarURL;
  }

  try {
    await account.save();
    return true;
  } catch (err) {
    console.error("Error when saving account: ", err);
    return false;
  }
}
