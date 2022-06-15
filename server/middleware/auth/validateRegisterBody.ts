import { NextApiRequest } from "next";
import { RegisterBodyInterface } from "@server/interfaces/requestBody";

// Throw an error if some data is wrong or else returns the valid data
export default function validateRegisterBody(
  req: NextApiRequest,
): RegisterBodyInterface {
  const { firstName, lastName, email, password, repeatedPassword } = req.body;

  if (isNameInvalid(firstName)) {
    throw "First name should contain at least two letters.";
  }

  if (isNameInvalid(lastName)) {
    throw "Last name should contain at least two letters.";
  }

  if (isEmailInvalid(email)) {
    throw "Invalid email.";
  }

  if (isPasswordInvalid(password)) {
    throw "Password is too short.";
  }

  if (typeof repeatedPassword !== "string" || password !== repeatedPassword) {
    throw "Passwords don't match.";
  }

  let validatedBody = {
    firstName,
    lastName,
    email,
    password,
    repeatedPassword,
  };

  // If it's not a business account, we can return here
  if (!req.body.isBusinessAccount) {
    return validatedBody;
  }

  const { companyName, companyWebsite } = req.body;

  if (typeof companyName !== "string" || companyName.length <= 0) {
    throw "Invalid company name";
  }

  return { ...validatedBody, companyName, companyWebsite };
}

// If we want to validate data from somewhere outside this middleware,
// we will also export the functions to do so.
// These functions return TRUE IF DATA IS INVALID
export function isNameInvalid(validationData: any): boolean {
  return typeof validationData !== "string" || validationData.length < 2;
}

export function isEmailInvalid(validationData: any): boolean {
  return (
    typeof validationData !== "string" ||
    validationData.length < 3 ||
    !validationData.includes("@") ||
    !validationData.includes(".")
  );
}

export function isPasswordInvalid(validationData: any): boolean {
  return typeof validationData !== "string" || validationData.length < 8;
}
