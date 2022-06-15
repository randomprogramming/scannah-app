import Company, { CompanyInterface } from "@server/models/Company";
import { Schema } from "mongoose";
import QRCodeOptions, {
  QR_CODE_OPTIONS_DEFAULTS,
} from "@server/interfaces/qrCodeOptions";
import { getAccountCompany } from "./AccountService";

export async function createCompany(
  accountId: Schema.Types.ObjectId,
  companyName: string,
  companyWebsite?: string,
): Promise<Schema.Types.ObjectId | null> {
  const company: CompanyInterface = new Company({
    name: companyName,
    website: companyWebsite,
  });

  (<Schema.Types.ObjectId[]>company.accounts).push(accountId);

  try {
    await company.save();

    return company._id;
  } catch (err) {
    console.error("Error when creating company: ", err);

    return null;
  }
}

export async function getCompanySettings(
  accountId: Schema.Types.ObjectId,
): Promise<CompanyInterface> {
  const company = await getAccountCompany(
    accountId,
    "name website logoURL qrCodeOptions",
  );

  if (!company) {
    throw "Business account is needed for this functionality.";
  }

  return company;
}

export async function setCompanySettings(
  accountId: Schema.Types.ObjectId,
  name: any,
  website: any,
  logoURL: any,
) {
  const company = await getCompanySettings(accountId);

  if (typeof name !== "string" || name.length === 0) {
    throw "Invalid company name.";
  }

  company.name = name;

  if (typeof website !== "string") {
    throw "Invalid company website";
  }

  company.website = website;

  if (typeof logoURL === "string") {
    company.logoURL = logoURL;
  }

  try {
    company.save();
    return true;
  } catch (err) {
    console.error("Error when saving company: ", err);

    return false;
  }
}

export async function setCompanyQrCodeSettings(
  accountId: Schema.Types.ObjectId,
  options: QRCodeOptions,
): Promise<boolean> {
  const company = await getAccountCompany(accountId);

  if (company) {
    company.qrCodeOptions = options;

    try {
      company.save();
      return true;
    } catch (err) {
      console.error("Error when saving company: ", err);
    }
  }
  return false;
}

export async function resetCompanyQrCodeSettings(
  accountId: Schema.Types.ObjectId,
): Promise<boolean> {
  return await setCompanyQrCodeSettings(accountId, QR_CODE_OPTIONS_DEFAULTS);
}
