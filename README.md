# Scannah

Application which will help people create relationships with customers and increase revenue by encouraging customers to visit their business again where they can get more codes and rewards.

Built fully using NextJS and TypeScript. MongoDB is being used as the database.

## Entity explanation

### Account

The basic account entity which stores information about the user themselves. A account belongs to a single `Company`, if it's a business account. If it's not a business account, the `Company` is unspecified and the user is here only to collect points and scan codes.

### Company

If the user decides to create a business account, they will be asked for some basic info about their company. Each user may belong to only one company, and a user can start as many `Campaign`s as they wish.

### Campaign

This entire application is based on campaigns. A user can start a campaign which should have a set goal. An example would be a campaign with the name "PlayStation Giveaway" where the user could generate `Code`s, which would allow customers to enter the giveaway by scanned said `Code`s.

### Campaign Type

Campaigns can be of many types, and each type should have their own description. This is where we store that info. Some examples of campaign types are: giveaways, points collector and lucky ticket.

### Campaign Props

Campaign props is where we associate people who scanned codes with what exactly they get by scanning that code. For instance, in the giveaway `Campaign Type`, people would get giveaway entries by scanning codes, and this is where we would store how much entries they have, and who exactly has entered the giveaway so far.

### Code

These are the actual codes which later get exported as graphical QR Codes for users to scan.

## API Endpoints

<table>

<tr>
<th>Route</th>
<th>File</th>
<th>Explanation</th>
</tr>

<tr>
<td><code>/api/auth/login</code></td>
<td><code>pages/api/auth/login.ts</code></td>
<td>Allows for logging in via email and password. <code>POST</code> method must be used. If the login was successful, it will set a cookie which is then used for authentication and authorization.</td>
</tr>

<tr>
<td><code>/api/auth/register</code></td>
<td><code>pages/api/auth/register.ts</code></td>
<td>Allows users to register. Expects <code>RegisterBodyInterface</code> in the body of a <code>POST</code> request.</td>
</tr>

<tr>
<td><code>/api/auth/me</code></td>
<td><code>pages/api/auth/me.ts</code></td>
<td>Expects a <code>GET</code> request and returns a <code>SessionAccount</code> which holds info about the currently logged in user if the user is logged in. Otherwise the <code>isLoggedIn</code> field is <code>false</code>.</td>
</tr>

<tr>
<td><code>/api/campaigns</code></td>
<td><code>pages/api/campaigns/index.ts</code></td>
<td>A <code>GET</code> request will return a list of <code>Campaign</code>s which belong to the currently logged in account, or to be exact, which belong to the accounts <code>Company</code>. A <code>POST</code> request expects a name and a <code>Campaign Type</code> ID, and then creates a <code>Campaign</code> with that info.</td>
</tr>

<tr>
<td><code>/api/campaigns/{campaignId}</code></td>
<td><code>pages/api/campaigns/[campaignId].ts</code></td>
<td>A <code>GET</code> request will return the <code>Campaign</code> that matches the provided <code>campaignId</code>.</td>
</tr>

<tr>
<td><code>/api/campaigns/scans</code></td>
<td><code>pages/api/campaigns/scans.ts</code></td>
<td>Expects a <code>POST</code> request with <code>campaignId</code> in the body. Returns a list of objects which say when a code was scanned and by whom it was scanned. It only shows the first letter of the person who scanned the code.</td>
</tr>

<tr>
<td><code>/api/campaigns/types</code></td>
<td><code>pages/api/campaigns/types/index.ts</code></td>
<td>With a <code>GET</code> request, returns a list of possible <code>Campaign Type</code>s.</td>
</tr>

<tr>
<td><code>/api/codes/generate</code></td>
<td><code>pages/api/codes/generate.ts</code></td>
<td>Expects a <code>POST</code> request with a <code>amount</code> and <code>campaignId</code> parameters in the body. This will generate <code>amount</code> of new active codes for the campaign that matches the <code>campaignId</code>.</td>
</tr>

<tr>
<td><code>/api/codes/export</code></td>
<td><code>pages/api/codes/export.ts</code></td>
<td>Expects a <code>POST</code> request with a <code>campaignId</code> body parameter. Exports all un-scanned codes for that campaign in a <code>.zip</code> format.</td>
</tr>

<tr>
<td><code>/api/codes/scan/coId/caId/codeId</code></td>
<td><code>pages/api/codes/scan/[...slug].ts</code></td>
<td>Expects a <code>GET</code> request with the <code>coId</code>, <code>caId</code> and <code>codeId</code> url parameters and marks the code as scanned. <code>coId</code> must match the company which the code belongs to. <code>caId</code> must match the campaign which the code belongs to.</td>
</tr>

<tr>
<td><code>/api/codes/me</code></td>
<td><code>pages/api/codes/me.ts</code></td>
<td>With a <code>GET</code> request, returns a QR Code SVG in string format that points to the account that generated this code. This is used to redeem rewards in shops.</td>
</tr>

<tr>
<td><code>/api/account/campaignParticipation/{accountId}</code></td>
<td><code>pages/api/account/campaignParticipation/[accountId].ts</code></td>
<td>With a <code>GET</code> request, returns a list of <code>CampaignPropsInterface</code> which basically tells you how much points, entries and etc. each user has in your campaigns.</td>
</tr>

<tr>
<td><code>/api/account/redeem</code></td>
<td><code>pages/api/account/redeem.ts</code></td>
<td>Expects a <code>POST</code> request with <code>campaignPropsId</code> and <code>participantAccountId</code> in the body. Allows you to redeem codes which user scanned, so that they don't try redeeming same reward multiple times.</td>
</tr>

<tr>
<td><code>/api/account/settings</code></td>
<td><code>pages/api/account/settings.ts</code></td>
<td>With a <code>GET</code> request retrieves all account settings which may be changed. With a <code>POST</code> request, changes those settings.
</tr>

<tr>
<td><code>/api/company/settings</code></td>
<td><code>pages/api/company/settings.ts</code></td>
<td>With a <code>GET</code> request returns an object <code>{qrCodeOptions, logoURL}</code>. With a <code>POST</code> request, changes those settings.
</tr>

<tr>
<td><code>/api/company/qr-code-settings</code></td>
<td><code>pages/api/company/qr-code-settings.ts</code></td>
<td>With a <code>GET</code> request retrieves all QR code settings which may be changed. With a <code>POST</code> request, changes those settings. With a <code>DELETE</code> request, it resets those options to defaults.
</tr>

<tr>
<td><code>/api/dashboard/stats</code></td>
<td><code>pages/api/dashboard/stats.ts</code></td>
<td>With a <code>GET</code> request retrieves all kinds of stats which are shown on the dashboard homepage.
</tr>

<tr>
<td><code>/api/third-party/cloudinary-signature</code></td>
<td><code>pages/api/third-party/cloudinary-signature.ts</code></td>
<td>Expects a <code>GET</code> request and returns object <code>{signature: "", timestamp: ""}</code> which is then used to sign image uploads to Cloudinary.</td>
</tr>

</table>

## .ENV

These are the environment variables which are needed to get the app running. During development use a `.env.local` file, and in production use the Vercel env variable feature.

- MONGO_URL: URL to the MongoDB database.

- NODE_ENV: `development` or `production`.

- AUTH_PASSWORD: The password is a private key you must pass at runtime, it has to be at least 32 characters long. Use [1password.com/password-generator](https://1password.com/password-generator/) to generate strong passwords.

- AUTH_COOKIE_NAME: The name of the cookie that stores data about authentication. Should be `AUTH_TOKEN` by default.

- NEXT_PUBLIC_PAGE_DOMAIN: The full domain where the app is currently hosted. For instance `www.google.com`. During production set this to `http://localhost:3000`.

- AZURE_STORAGE_CONNECTION_STRING: Azure subscription ID for accessing the storage.

- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: Cloudinary Cloud Name where images get uploaded.

- NEXT_PUBLIC_CLOUDINARY_API_KEY: Cloudinary API Key.

- CLOUDINARY_API_SECRET: Cloudinary API Secret, must stay private.
