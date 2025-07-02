// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
// });

// const sendemail = async (email, otp) => {
//   console.log("hellofff", email, otp);

//   try {
//     const info = await transporter.sendMail({
//       from: '"Maddison Foo Koch 👻" <sumitgupta.nerasoft@gmail.com>', // sender address
//       to: email, // list of receivers
//       subject: "Your OTP Code", // Subject line
//       text: otp, // plain text body
//     });
//     console.log("Message sent: %s", info);
//   } catch (error) {
//     console.log(error);
//   }
// };

// export { sendemail };
import nodemailer from "nodemailer";
import dotenv from "dotenv"


dotenv.config({})

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App Password
  },
});


export const sendemail = async (email, otp) => {
  console.log(email);
  try {
    // console.log("eMAIL",process.env.EMAIL_USER);
    // console.log("pASSWORD",process.env.EMAIL_PASSWORD);
    const info = await transporter.sendMail({
      // from: '"SixCash OTP" <your_email@example.com>',
      from: '"Maddison Foo Koch 👻" <vibesslocal@gmail.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });
    console.log(info);
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error( error);
  }
};
