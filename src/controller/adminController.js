
import { UserOtp } from "../models/Otp.js";
import { generateAndSendOtp } from "../utils/otp.js";
import { errorResponse, successResponse } from "../lib/reply.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { decryptData, encryptData } from "../lib/encrypt.js";
import UserToken from "../models/UserToken.js";
import Admin from "../models/Admin.js";


// export const adminLogin = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));
//     const { email, password, otp } = decrypted;
//     console.log(decrypted)

//     if (!email || (!password && !otp)) {
//       return res.status(400).json(errorResponse(400, "Email and password or OTP required", false));
//     }

//     // Validate Admin Email
//     if (email !== process.env.Admin_email) {
//       return res.status(401).json(errorResponse(401, "Unauthorized admin email", false));
//     }

//     // Find admin
//     let admin = await Admin.findOne({ email });

//     // If not found, create with hashed password
//     if (!admin) {
//       if (!password) {
//         return res.status(400).json(errorResponse(400, "Password is required for new admin", false));
//       }
//       const hashedPassword = await bcrypt.hash(password, 10);
//       admin = await Admin.create({ email, password: hashedPassword });
//     }

//     // Step 1: email + password → send OTP
//     if (password && !otp) {
//       const isMatch = await bcrypt.compare(password, admin.password);
//       if (!isMatch) {
//         return res.status(401).json(errorResponse(401, "Invalid credentials", false));
//       }

//       await generateAndSendOtp(email);
//       return res.status(200).json(successResponse(200, "OTP sent to your email", "", true));
//     }

//     // Step 2: verify OTP
//     if (otp) {
//       const otpRecord = await UserOtp.findOne({ otp });
//       console.log(otpRecord,"hello worlddd")
//       if (otpRecord?.otp !== otp) {
//         return res.status(400).json(errorResponse(400, "Invalid or expired OTP", false));
//       }

//       // await UserOtp.deleteOne({ _id: otpRecord._id });

//       const token = jwt.sign({ id: admin._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "7d" });
//       const base64Token = Buffer.from(token).toString("base64");
//       const encryptedToken = encryptData(base64Token).encryptedData;

//       // Save token to DB
//       await UserToken.create({
//         token: encryptedToken,
//         user_id: admin._id,
//         status: "active",
//       });

//       return res.status(200).json(successResponse(200, "Login successful", encryptedToken, true));
//     }

//     return res.status(400).json(errorResponse(400, "Missing login data", false));
//   } catch (error) {
//     console.error("Admin Login error:", error);
//     return res.status(500).json(errorResponse(500, error.message, "Internal server error", false));
//   }
// };


export const adminLogin = async (req, res) => {
  try {
    // const { body } = req.body;
    // const decrypted = JSON.parse(decryptData(body));
    const { email, password, otp } = req.decryptedBody;
    // console.log(decrypted);


    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json(errorResponse(400, "Invalid email format", false));
    }

    if (!email || (!password && !otp)) {
      return res.status(400).json(errorResponse(400, "Email and password or OTP required", false));
    }


    const adminEmail = process.env.Admin_email;
    if (email !== adminEmail) {
      return res.status(401).json(errorResponse(401, "Unauthorized admin email", false));
    }

   
    const encryptedEmail = encryptData(email).encryptedData;

   
    let admin = await Admin.findOne({ email: encryptedEmail });

 
    if (!admin) {
      if (!password) {
        return res.status(400).json(errorResponse(400, "Password is required for new admin", false));
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = await Admin.create({ email: encryptedEmail, password: hashedPassword });
    }

 
    if (password && !otp) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json(errorResponse(401, "Invalid credentials", false));
      }

      await generateAndSendOtp(email); 
      return res.status(200).json(successResponse(200, "OTP sent to your email", "", true));
    }

  
    if (otp) {
      const otpRecord = await UserOtp.findOne({ otp });
      console.log(otpRecord, "hello worlddd");

      if (!otpRecord || otpRecord.otp !== otp) {
        return res.status(400).json(errorResponse(400, "Invalid or expired OTP", false));
      }

      // Optional: delete OTP after use
      // await UserOtp.deleteOne({ _id: otpRecord._id });

      const token = jwt.sign({ id: admin._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "7d" });
      const base64Token = Buffer.from(token).toString("base64");
      const encryptedToken = encryptData(base64Token).encryptedData;
      
      await UserToken.create({
        token: encryptedToken,
        user_id: admin._id,
        status: "active",
      });

      return res.status(200).json(successResponse(200, "Login successful", encryptedToken, true));
    }

    return res.status(400).json(errorResponse(400, "Missing login data", false));
  } catch (error) {
    console.error("Admin Login error:", error);
    return res.status(500).json(errorResponse(500, error.message, "Internal server error", false));
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { body } = req.body;
    const decrypted = JSON.parse(decryptData(body));
    const { email, otp } = decrypted;

    if (!email || !otp) {
      return res
        .status(400)
        .json(errorResponse(400, "Email and OTP are required", false));
    }

    if (email !== process.env.Admin_email) {
      return res
        .status(401)
        .json(errorResponse(401, "Unauthorized admin email", false));
    }

    const user = await Admin.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json(errorResponse(404, "Admin not found", false));
    }

    const otpRecord = await UserOtp.findOne({ otp });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid or expired OTP", false));
    }


    // Generate reset token (valid 15 mins)
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "15m",
    });

    const resetLink = `https://nifi-dashboard.vercel.app/set-new-password?token=${token}`;

    // Send reset link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Link",
      html: `<p>Dear Admin,</p>
             <p>We verified your OTP. Click the link below to reset your password:</p>
             <a href="${resetLink}" target="_blank">Reset Password</a>
             <p>This link is valid for 15 minutes.</p>`,
    });

    return res
      .status(200)
      .json(successResponse(200, "Password reset link sent", "", true));
  } catch (error) {
    
    return res
      .status(500)
      .json(errorResponse(500, error.message, "Internal Server Error", false));
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Token from URL param: /reset-password/:token
    const { body } = req.body;
    const decrypted = JSON.parse(decryptData(body));
    const { newPassword, confirmPassword } = decrypted;

    if (!token) {
      return res
        .status(400)
        .json(errorResponse(400, "Token is required", false));
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json(
        errorResponse(
          400,
          "Both new password and confirm password are required",
          false
        )
      );
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json(errorResponse(400, "Passwords do not match", false));
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    } catch (err) {
      return res
        .status(401)
        .json(errorResponse(401, "Invalid or expired token", false));
    }

    // Find the user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json(errorResponse(404, "User not found", false));
    }

    // Hash and update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res
      .status(200)
      .json(successResponse(200, "Password reset successful", "", true));
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json(
      errorResponse(500, error.message, "Internal Server Error", false)
    );
  }
};