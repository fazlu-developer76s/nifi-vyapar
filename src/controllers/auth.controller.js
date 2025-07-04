import { successResponse, errorResponse } from "../utils/response.js";
import { OAuth2Client } from "google-auth-library";
import { sendEmailOTP } from "../services/emailotp.service.js";
import { sendMobileOTP } from "../services/mobileotp.service.js";
import { Otp } from "../models/otp.model.js";

const CLIENT_ID = process.env.YOUR_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export const signinWithgoogle = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    const resp = {
      id: sub,
      email: email,
      name: name,
      picture: picture,
    };
    console.log(resp);
    successResponse(res, "User verified successfully", resp, 200);
  } catch (error) {
    errorResponse(res, "Invalid token", 401);
  }
};

export const sendOtp = async (req, res) => {
  const { login_key } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[6-9]\d{9}$/;
  try {
    if (emailRegex.test(login_key)) {
      if (sendEmailOTP(login_key, "123456")) {
        const otp = new Otp({
          field_value: login_key,
          otp: "123456",
          type: "email",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
        });
        await otp.save();
      }
    } else if (mobileRegex.test(login_key)) {
      if(sendMobileOTP(login_key, "123456")){
        const otp = new Otp({
          field_value: login_key,
          otp: "123456",
          type: "mobile",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
        });
        await otp.save();
      }
    } else {
      return errorResponse(res, "Invalid login key format", 400);
    }
    successResponse(res, "OTP sent successfully", login_key, 200);
  } catch (error) {
    errorResponse(res, "Failed to send OTP", 500);
  }
};
