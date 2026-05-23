export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/** True when Manus OAuth env vars are present (required for external sign-in). */
export const isOAuthConfigured = () =>
  Boolean(import.meta.env.VITE_OAUTH_PORTAL_URL && import.meta.env.VITE_APP_ID);

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = (): string => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  // Local dev without Manus OAuth: use in-app login page instead of crashing.
  if (!oauthPortalUrl || !appId) {
    return "/login";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL("/app-auth", oauthPortalUrl);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

export const WHATSAPP_NUMBER = "14693676317";

