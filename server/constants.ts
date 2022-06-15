export const SESSION_NAME = "account";

export enum CAMPAIGN_TYPES_ENUM {
  giveaway = "Giveaway",
  luckyTicket = "Lucky Ticket",
  pointCollector = "Point Collector",
}

// URL To the Azure Function app which handles the code exports in the background.
// Expects only a campaignId in the POST body.
export const UPLOADER_FUNCTION_URL = process.env.AZURE_UPLOADER_FUNCTION_URL;
