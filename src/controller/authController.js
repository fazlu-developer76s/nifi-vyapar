import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../models/User.js";
import { generateAndSendOtp } from "../utils/otp.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { decryptData, encryptData } from "../lib/encrypt.js";
import { UserOtp } from "../models/Otp.js";
import UserToken from "../models/UserToken.js";
import { OAuth2Client } from "google-auth-library";
import { oauth2Client } from "../utils/googleConfig.js";


export const googleAuth = async (req, res, next) => {
  try {
    const code = req.query?.code;
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email } = userRes.data;

    const encryptedEmail = encryptData(email)?.encryptedData;
    console.log(encryptedEmail);
    let user = await User.findOne({ email: encryptedEmail });

    if (!user) {
      user = await User.create({
        email: encryptedEmail,
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: "2d",
      }
    );
    const base64Token = Buffer.from(jwtToken).toString("base64");
    const encryptedToken = encryptData(base64Token).encryptedData;

    await UserToken.create({
      token: encryptedToken,
      user_id: user._id,
      status: "active",
    });
    console.log(encryptedToken);
    res
      .status(200)
      .json(successResponse(200, "successfully", encryptedToken, true, user));
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json(errorResponse(500, err.message, "Something went wrong", false));
  }
};

// export const signUpLog = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));
//     const { email, mobile, otp } = decrypted;

//     if (!email && !mobile) {
//       return res
//         .status(400)
//         .json(encryptData(errorResponse(400, "Email or mobile is required", false)));
//     }

//     const user = await User.findOne({ email , mobile  });
// console.log(user,"user")
//     if (!otp) {
//       await generateAndSendOtp(email, mobile);
//       const message = user ? "OTP sent for login." : "OTP sent for signup.";
//       return res.status(200).json(successResponse(200, message, "", true));
//     }

//     const otpRecord = await UserOtp.findOne({otp,$or: [{ email }, { mobile }]});

//     if (!otpRecord || otpRecord.otp !== otp) {
//       return res
//         .status(400)
//         .json(encryptData(errorResponse(400, "Invalid or expired OTP", false)));
//     }

//     let finalUser;
//     let messages;

//     if (!user) {
//       const newUser = new User({ email, mobile });
//       finalUser = await newUser.save();
//       messages = "Signup successful";
//     } else {
//       finalUser = user;
//       messages = "Login successful";
//     }

//     const jwtToken = jwt.sign({ id: finalUser._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "7d" });
//     const base64Token = Buffer.from(jwtToken).toString("base64");
//     const encryptedToken = encryptData(base64Token).encryptedData;

//     await UserToken.create({
//       token: encryptedToken,
//       user_id: finalUser._id,
//       status: "active"
//     });

//     return res.status(201).json(successResponse(201, messages, encryptedToken, true));

//   } catch (error) {
//     console.error("Auth error:", error);
//     return res
//       .status(500)
//       .json(encryptData(errorResponse(500, error.message, false, "Internal server error")));
//   }
// };

export const signUpLog = async (req, res) => {
  try {
    // const { body } = req.body;
    // console.log("Request Body:", body);

    // const decryptedBody = decryptData(body);
    // console.log("Decrypted Body:", decryptedBody);

    // const parsedBody = JSON.parse(decryptedBody);
    // console.log("Parsed Body:", parsedBody);

    const { email, mobile, otp } = req.decryptedBody;

    if (!email && !mobile) {
      return res
        .status(400)
        .json(
          encryptData(errorResponse(400, "Email or mobile is required", false))
        );
    }

    const encryptedEmail = email ? encryptData(email).encryptedData : null;
    const encryptedMobile = mobile ? encryptData(mobile).encryptedData : null;

    const query = {};
    if (encryptedEmail) query.email = encryptedEmail;
    if (encryptedMobile) query.mobile = encryptedMobile;

    const user = await User.findOne(query);
    console.log(user, "user");

    if (!otp) {
      await generateAndSendOtp(email, mobile);
      const message = user ? "OTP sent for login." : "OTP sent for signup.";
      return res.status(200).json(successResponse(200, message, "", true));
    }

    const otpRecord = await UserOtp.findOne({
      otp,
      $or: [
        encryptedEmail ? { email: encryptedEmail } : {},
        encryptedMobile ? { mobile: encryptedMobile } : {},
      ],
    });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res
        .status(400)
        .json(encryptData(errorResponse(400, "Invalid or expired OTP", false)));
    }

    let finalUser;
    let messages;

    if (!user) {
      const newUser = new User({
        email: encryptedEmail,
        mobile: encryptedMobile,
        role_id: "",
      });
      finalUser = await newUser.save();
      messages = "Signup successful";
    } else {
      finalUser = user;
      messages = "Login successful";
    }

    const jwtToken = jwt.sign(
      { id: finalUser._id },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    const base64Token = Buffer.from(jwtToken).toString("base64");
    const encryptedToken = encryptData(base64Token).encryptedData;

    await UserToken.create({
      token: encryptedToken,
      user_id: finalUser._id,
      status: "active",
    });

    return res
      .status(201)
      .json(successResponse(201, messages, encryptedToken, true));
  } catch (error) {
    console.error("Auth error:", error);
    return res
      .status(500)
      .json(
        encryptData(
          errorResponse(500, error.message, false, "Internal server error")
        )
      );
  }
};

export const logoutUser = async (req, res) => {
  try {
    const encryptedToken = req.headers.authorization;

    if (!encryptedToken) {
      return res
        .status(401)
        .json(errorResponse(401, "Authorization token is missing", false));
    }

    // Decrypt token and convert from Base64 to original JWT
    const decryptedToken = decryptData(encryptedToken);
    const jwtToken = Buffer.from(decryptedToken, "base64").toString("utf8");

    // Invalidate the token in DB
    const tokenRecord = await UserToken.findOneAndUpdate(
      { token: encryptedToken, status: "active" },
      { status: "inactive" }
    );

    if (!tokenRecord) {
      return res
        .status(400)
        .json(errorResponse(400, "Token already expired or invalid", false));
    }

    return res
      .status(200)
      .json(successResponse(200, "Logged out successfully", "", true));
  } catch (error) {
    console.error("Logout error:", error.message);
    return res
      .status(500)
      .json(errorResponse(500, "Internal server error", false));
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;

    const users = await User.find();

    const filteredUsers = users
      .map((user) => {
        return {
          _id: user._id,
          name: user.name ? decryptData(user.name) : null,
          email: user.email ? decryptData(user.email) : null,
          mobile: user.mobile ? decryptData(user.mobile) : null,
          status: user.status ? decryptData(user.status) : null,
          createdAt: user.createdAt,
        };
      })
      .filter((user) => {
        if (!search) return true;

        const s = search.toLowerCase();
        return (
          (user.name && user.name.toLowerCase().includes(s)) ||
          (user.email && user.email.toLowerCase().includes(s))
        );
      });

    if (!filteredUsers.length) {
      return res.status(404).json(errorResponse(404, "No users found", false));
    }

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Users fetched successfully",
          "",
          true,
          filteredUsers
        )
      );
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

// const googleAuth = async (req, res, next) => {
//   try {
//     const code = req.query?.code;
//     const googleRes = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(googleRes.tokens);
//     const userRes = await axios.get(
//       `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
//     );
//     const { email } = userRes.data;

//     const encryptedEmail = encryptData(JSON.stringify(email))?.encryptedData;
//     console.log(encryptedEmail);
//     let user = await User.findOne({ email: encryptedEmail });

//     if (!user) {
//       user = await User.create({
//         email: encryptedEmail,
//       });
//     }

//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.TOKEN_SECRET_KEY,
//       {
//         expiresIn: "2d",
//       }
//     );
//     console.log(token);
//     res
//       .status(200)
//       .json(successResponse(200, "successfully", token, true, user));
//   } catch (err) {
//     res
//       .status(500)
//       .json(errorResponse(500, err.message, "Something went wrong", false));
//   }
// };


export const requestOtpForChange = async (req, res) => {
  try {
    const { email, mobile } = req.decryptedBody;

    if (!email && !mobile) {
      return res
        .status(400)
        .json(
          encryptData(errorResponse(400, "Email or mobile required", false))
        );
    }

    const otp = "654321"; // or use Math.random
    const userId = req.user._id;

    await UserOtp.findOneAndUpdate(
      { user_id: userId },
      { otp, email, mobile },
      { upsert: true }
    );

    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      generateAndSendOtp(email, otp);
    }

    if (mobile && /^[0-9]{10}$/.test(mobile)) {
      generateAndSendOtp(mobile, otp);
    }

    return res
      .status(200)
      .json(encryptData(successResponse(200, "OTP sent", null, true)));
  } catch (error) {
    console.error("OTP Change Error:", error);
    return res
      .status(500)
      .json(encryptData(errorResponse(500, error.message, false)));
  }
};

export const verifyOtpAndUpdate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otp } = req.decryptedBody;

    const otpEntry = await UserOtp.findOne({ user_id: userId });

    if (!otpEntry || otpEntry.otp !== otp) {
      return res
        .status(400)
        .json(encryptData(errorResponse(400, "Invalid or expired OTP", false)));
    }

    const updateData = {};

    if (otpEntry.email) {
      const encryptedEmail = encryptData(otpEntry.email).encryptedData;

      const emailExists = await User.findOne({
        email: encryptedEmail,
        _id: { $ne: userId },
      });
      if (emailExists) {
        return res
          .status(409)
          .json(encryptData(errorResponse(409, "Email already in use", false)));
      }

      updateData.email = encryptedEmail;
    }

    if (otpEntry.mobile) {
      const encryptedMobile = encryptData(otpEntry.mobile).encryptedData;

      const mobileExists = await User.findOne({
        mobile: encryptedMobile,
        _id: { $ne: userId },
      });
      if (mobileExists) {
        return res
          .status(409)
          .json(
            encryptData(errorResponse(409, "Mobile already in use", false))
          );
      }

      updateData.mobile = encryptedMobile;
    }

    await User.findByIdAndUpdate(userId, { $set: updateData });
    await UserOtp.deleteOne({ user_id: userId });

    return res
      .status(200)
      .json(
        encryptData(
          successResponse(200, "Profile updated successfully", null, true)
        )
      );
  } catch (error) {
    console.error("OTP verify error:", error);
    return res
      .status(500)
      .json(encryptData(errorResponse(500, error.message, false)));
  }
};

export const facebookAuth = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json(errorResponse(400, "Code is required", false));
    }

    // Step 1: Exchange code for access token
    const tokenResponse = await axios.get("https://graph.facebook.com/v18.0/oauth/access_token", {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI, // same as configured in Facebook App
        code,
      },
    });

    const access_token = tokenResponse.data.access_token;

    // Step 2: Get user info
    const userInfo = await axios.get("https://graph.facebook.com/me", {
      params: {
        fields: "id,name,email,picture",
        access_token,
      },
    });

    const { email } = userInfo.data;

    if (!email) {
      return res.status(400).json(errorResponse(400, "Email permission is required", false));
    }

    // Step 3: Encrypt & store user
    const encryptedEmail = encryptData(email)?.encryptedData;
    let user = await User.findOne({ email: encryptedEmail });

    if (!user) {
      user = await User.create({ email: encryptedEmail });
    }

    // Step 4: Generate and save token
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "2d" }
    );
    const base64Token = Buffer.from(jwtToken).toString("base64");
    const encryptedToken = encryptData(base64Token).encryptedData;

    await UserToken.create({
      token: encryptedToken,
      user_id: user._id,
      status: "active",
    });

    res.status(200).json(
      successResponse(200, "Successfully logged in via Facebook", encryptedToken, true, user)
    );
  } catch (err) {
    console.error("Facebook Auth Error:", err.response?.data || err.message);
    res.status(500).json(errorResponse(500, err.message, "Something went wrong", false));
  }
};


export const editUserData = async (req, res) => {
  try {
    
    const user = req.user;
const { body } = req.body;

    const decryptedBody = decryptData(body);
    const parsedBody = JSON.parse(decryptedBody);
    const { name, mobile,  avatar,address } = parsedBody;

    const findUser = await User.findById(user?._id);
    console.log(findUser)
    if (!findUser) {
      return res.status(404).json(errorResponse(404, "", false, "User not found"));
    }

    const updateUserDetails = {};

    // Update other fields immediately
    if (name) updateUserDetails.name = encryptData(JSON.stringify(name))?.encryptedData;
    if (mobile) updateUserDetails.mobile = encryptData(JSON.stringify(mobile))?.encryptedData;
    if (avatar) updateUserDetails.avatar = encryptData(JSON.stringify(avatar))?.encryptedData;
   if(address) updateUserDetails.address=encryptData(JSON.stringify(address))?.encryptedData;
   

    const updatedUser = await User.findByIdAndUpdate(user?.id, { $set: updateUserDetails }, { new: true });

    if (!updatedUser) {
      return res.status(404).json(errorResponse(404, "", false, "Failed to update user data"));
    }
    return res.status(200).json(successResponse(200, "User data updated successfully", true, updatedUser));

  } catch (error) {
    console.log(error)
    return res?.status(500).json(errorResponse(500, error.message, false, "Something went wrong"));
  }
};