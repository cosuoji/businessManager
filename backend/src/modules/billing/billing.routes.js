import express from "express";

import {
    initializeProCheckout,
    verifyPayment,
    getSubscription,
    syncSubscription,
    cancelSubscription,
    resumeSubscription
} from "./billing.controller.js";
import {
    handleFlutterwaveWebhook,
} from "./billing.webhook.js";


const router = express.Router();

router.post(
    "/webhook",
    handleFlutterwaveWebhook
);

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

router.post(
    "/subscription/resume",
    resumeSubscription
);

export default router;
