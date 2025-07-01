import { google } from "googleapis"

const GOOGLE_CLIENT_ID = '249296602463-2ssfb63d2c3lttcndupuqr54hdh350t1.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

export const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage'
);