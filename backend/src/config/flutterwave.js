import dotenv from 'dotenv';
dotenv.config();

export const flutterwaveConfig = {
    publicKey:
        process.env.FLUTTERWAVE_PUBLIC_KEY,

    secretKey:
        process.env.FLUTTERWAVE_SECRET_KEY,

    proPlanId:
        process.env.FLUTTERWAVE_PRO_PLAN_ID,

    webhookSecret:
        process.env.FLUTTERWAVE_WEBHOOK_SECRET,
};
