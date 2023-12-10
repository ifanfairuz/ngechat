import { ManagementClient } from "auth0";

const url = new URL(process.env.AUTH0_ISSUER_BASE_URL || "");
export const management = new ManagementClient({
  domain: url.host,
  clientId: process.env.AUTH0_CLIENT_ID || "",
  clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
});
