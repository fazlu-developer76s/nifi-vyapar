import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const sendMobileOTP = async (mobile, otp) => {
  try {
    const message = `Dear User Your OTP For Login in sixcash is ${otp} Valid For 10 Minutes. we request you to don't share with anyone .Thanks NSAFPL`;
    const params = {
      UserID: process.env.NERASOFT_USERID,
      Password: process.env.NERASOFT_PASSWORD,
      SenderID: process.env.NERASOFT_SENDER,
      Phno: mobile,
      Msg: message,
      EntityID: process.env.NERASOFT_ENTITYID,
      TemplateID: process.env.NERASOFT_TEMPLATEID,
    };

    const url = 'http://sms.nerasoft.in/api/SmsApi/SendSingleApi?' + new URLSearchParams(params).toString();

    const response = await axios.post(url);
    console.log('SMS sent:', response.data);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error.response?.data || error.message);
    return false;
  }
};
