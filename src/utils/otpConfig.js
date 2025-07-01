

import axios from "axios"
async function userOTP(mobile = "", otp) {
    // SMS API Integration
    const mobileNo = mobile;

    const entityId = '1701159540601889654';
    const senderId = 'NRSOFT';
    const tempId = '1707164805234023036';
    const userId = 'NERASOFT1';
    const password = '111321';

    // Generate a random 4-digit OTP if not provided
    //  otp = otp || crypto.randomInt(1000, 9999);

    const message = `Dear User Your OTP For Login in sixcash is ${otp} Valid For 10 Minutes. we request you to don't share with anyone. Thanks NSAFPL`;
    console.log("message", message, otp);

    // Build the API URL with query parameters
    const url = `http://sms.nerasoft.in/api/SmsApi/SendSingleApi?UserID=${userId}&Password=${password}&SenderID=${senderId}&Phno=${mobileNo}&Msg=${encodeURIComponent(message)}&EntityID=${entityId}&TemplateID=${tempId}`;

    try {
        // Make the API request using axios
        const response = await axios.post(url);

        // Check if the API call was successful
        if (response.status === 200) {
            console.log("response", response.data);

            console.log('SMS sent successfully');
            return Number(otp);
        } else {
            console.error('Failed to send SMS:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        return null;
    }
}

export { userOTP };