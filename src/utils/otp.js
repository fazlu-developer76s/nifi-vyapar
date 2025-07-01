// import { userOTP } from "./otpConfig.js";
// import UserOtp from "../models/User.js";
// import { sendemail } from "./emailConfig.js";

// const generateAndSendOtp = async function (email, mobile) {
//   console.log(email, mobile);
//   try {
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const otpExit = await UserOtp.findOne({ email: email, mobile: mobile });
//     let record = otpExit;
//     if (otpExit) {
//       await UserOtp.findOneAndUpdate({ _id: otpExit._id }, { $set: { otp: otp } });
//     } else {
//       record = await UserOtp.create({ otp, email, mobile });
//     }

//     if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       sendemail(email, otp.toString());
//     } else {
//       console.log("Invalid email:", email);
//     }

//     if (mobile && /^[0-9]{10}$/.test(mobile)) {
//       userOTP(mobile, otp);
//     } else {
//       console.log("Invalid mobile number:", mobile);
//     }
//     return record;
//   } catch (error) {
//     throw error;
//   }
// };

// export { generateAndSendOtp };


import { userOTP } from "./otpConfig.js";
import { sendemail } from "./emalConfig.js";
import { UserOtp } from "../models/Otp.js";

export const generateAndSendOtp = async (email, mobile) => {
  console.log(email, mobile);

  try {
    // const otp = Math.floor(100000 + Math.random() * 900000);

    const otp = "123456";
    const record = await UserOtp.create({ otp, email, mobile });

    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      sendemail(email, otp.toString());
    }

    if (mobile && /^[0-9]{10}$/.test(mobile)) {
      userOTP(mobile, otp);
    }

    return record;
  } catch (error) {
    console.error("generateAndSendOtp error:", error);
    throw error;
  }
};
