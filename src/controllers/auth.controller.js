import { successResponse, errorResponse } from "../utils/response.js";
import { OAuth2Client } from "google-auth-library";


const CLIENT_ID = process.env.YOUR_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);


export const signinWithgoogle = async (req, res) => {
  
  const { credential } = req.body;
  console.log(req.body);
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    const resp = {
      id: sub,
      email:email,
      name: name,
      picture: picture
    }
    console.log(resp);
    successResponse(res,"User verified successfully",resp,200);
  } catch (error) {
    errorResponse(res, "Invalid token", 401);
  }
};
