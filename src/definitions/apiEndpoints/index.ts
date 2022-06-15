export const ME_URL = "/api/auth/me";
export const LOGIN_URL = "/api/auth/login";
export const REGISTER_URL = "/api/auth/register";
export const CAMPAIGN_URL = "/api/campaigns";
export const CAMPAIGN_ID_URL = (_id: string) => CAMPAIGN_URL + `/${_id}`;
export const GENERATE_CODES_URL = "/api/codes/generate";
export const EXPORT_CODES_URL = "/api/codes/export";
export const CAMPAIGN_TYPES_URL = CAMPAIGN_URL + "/types";
export const CAMPAIGN_SCANS_URL = CAMPAIGN_URL + "/scans";
export const MY_QRCODE_URL = "/api/codes/me";
export const CAMPAIGN_PARTICIPATION_URL = (_participantAccountId: string) =>
  "/api/account/campaignParticipation/" + _participantAccountId;
export const REDEEM_PARTICIPATION_URL = "/api/account/redeem";
export const ACCOUNT_SETTINGS_URL = "/api/account/settings";
export const COMPANY_SETTINGS_URL = "/api/company/settings";
export const QR_CODE_SETTINGS_URL = "/api/company/qr-code-settings";
export const DASHBOARD_STATS_URL = "/api/dashboard/stats";
export const GET_CLOUDINARY_SIGNATURE_URL =
  "/api/third-party/cloudinary-signature";
export const CODE_URL = (codeId: string) => "/api/codes/" + codeId;
export const LOGOUT_URL = "/api/auth/logout";
export const GIVEAWAY_WINNER_DRAWS_URL = "/api/campaigns/giveaway-draw";
