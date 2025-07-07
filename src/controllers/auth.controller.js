import { successResponse, errorResponse } from "../utils/response.js";
import { OAuth2Client } from "google-auth-library";
import { sendEmailOTP } from "../services/emailotp.service.js";
import { sendMobileOTP } from "../services/mobileotp.service.js";
import { Otp } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { generateToken, generateOTP } from "../services/jwt.service.js";
import { Token } from "../models/token.model.js";
import { Role } from "../models/role.model.js";
const CLIENT_ID = process.env.YOUR_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[6-9]\d{9}$/;

export const signinWithgoogle = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    const findUser = await User.findOne({ email: email });

    if (findUser) {
      const expireAlltoken = await Token.updateMany(
        { userID: findUser._id },
        { token_status: "expired" }
      );
      const user = {
        id: findUser._id,
        name: findUser.name || "Guest",
        email: findUser.email || login_key,
        mobile: findUser.mobile || null,
        picture: findUser.picture || null,
      };
      const getToken = generateToken(user);
      if (getToken) {
        const token = new Token({
          userID: findUser._id,
          token: getToken,
        });
        await token.save();
        successResponse(
          res,
          "Sign-in successful",
          { user, token: getToken },
          200
        );
      }
    } else {
      errorResponse(res, "Invalid credentials", 401);
    }
  } catch (error) {
    errorResponse(res, "Invalid credentials", 401);
  }
};

export const signInFunction = async (req, res) => {
  const { login_key, otp } = req.body;
  let type;
  if (emailRegex.test(login_key)) {
    type = "email";
  } else if (mobileRegex.test(login_key)) {
    type = "mobile";
  } else {
    return errorResponse(res, "Invalid login key format", 400);
  }
  try {
    const otpRecord = await Otp.findOne({
      field_value: login_key,
      type: type,
      otp: otp,
      otp_status: "pending",
      expiresAt: { $gt: new Date() },
    });
    if (!otpRecord) {
      return errorResponse(res, "Invalid or expired OTP", 401);
    }

    const expiredOtp = await Otp.findByIdAndUpdate(
      otpRecord._id, // Use the document ID directly
      { otp_status: "expired" },
      { new: true } // Return the updated document
    );

    let findUser = await User.findOne({
      [type]: login_key,
    });

    const getAdminRole = await Role.findOne({ role: "admin" });
    if (!getAdminRole) {
      errorResponse(res, "Admin role not found", 500);
    }
    if (!findUser) {
      const newUser = new User({
        [type]: login_key,
        role: getAdminRole._id,
      });
      await newUser.save();
    }
    findUser = await User.findOne({
      [type]: login_key,
    });

    const user = {
      id: findUser._id,
      name: findUser.name || "Guest",
      email: findUser.email || login_key,
      mobile: findUser.mobile || null,
      picture: findUser.picture || null,
    };
    const expireAlltoken = await Token.updateMany(
      { userID: findUser._id },
      { token_status: "expired" }
    );
    const getToken = generateToken(user);
    if (getToken) {
      const token = new Token({
        userID: findUser._id,
        token: getToken,
      });
      await token.save();
      successResponse(
        res,
        "Sign-in successful",
        { user, token: getToken },
        200
      );
    } else {
      errorResponse(res, "Invalid credentials", 401);
    }
  } catch (error) {
    errorResponse(res, "Sign-in failed", 500);
  }
};

export const sendOtp = async (req, res) => {
  const { login_key } = req.body;
  try {
    const gen_otp = generateOTP();
    if (emailRegex.test(login_key)) {
      if (sendEmailOTP(login_key, gen_otp)) {
        const expireAllotp = await Otp.updateMany(
          { field_value: login_key, type: "email" },
          { otp_status: "expired" }
        );
        const otp = new Otp({
          field_value: login_key,
          otp: gen_otp,
          type: "email",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
        });
        await otp.save();
      }
    } else if (mobileRegex.test(login_key)) {
      if (sendMobileOTP(login_key, gen_otp)) {
        const expireAllotp = await Otp.updateMany(
          { field_value: login_key, type: "mobile" },
          { otp_status: "expired" }
        );
        const otp = new Otp({
          field_value: login_key,
          otp: gen_otp,
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
