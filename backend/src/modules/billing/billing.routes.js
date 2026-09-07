import express from "express";

import {
    initializeProCheckout,
    verifyPayment,
    getSubscription,
    syncSubscription,
    cancelSubscription,
} from "./billing.controller.js";
import {
    handleFlutterwaveWebhook,
} from "./billing.webhook.js";

import { authenticate } from "../../middleware/auth.js";
const router = express.Router();

router.post(
    "/webhook",
    handleFlutterwaveWebhook
);

router.use(authenticate);

router.post(
    "/checkout",
    initializeProCheckout
);

router.post(
    "/verify",
    verifyPayment
);

router.get(
    "/subscription",
    getSubscription
);

router.post(
    "/subscription/sync",
    syncSubscription
);

router.post(
    "/subscription/cancel",
    cancelSubscription
);


export default router;
