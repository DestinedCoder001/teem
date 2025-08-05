import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv"

dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET
const redirectUri = process.env.CLIENT_URL
const client = new OAuth2Client(
  clientId,
  clientSecret,
  redirectUri
);

const verifyGoogleToken = async (code: string) => {
  const { tokens } = await client.getToken(code);

  const idToken = tokens.id_token;
  const ticket = await client.verifyIdToken({
    idToken: idToken as string,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
};

export { verifyGoogleToken, client };
