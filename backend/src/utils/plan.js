import {
  PLAN_LIMITS,
  PLAN_FEATURES,
} from "../config/plans.js";

export const getUserPlan = (user) => {
  return user?.subscription?.plan || "free";
};

export const getPlanLimits = (user) => {
  const plan = getUserPlan(user);

  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
};

export const getPlanFeatures = (user) => {
  const plan = getUserPlan(user);

  return PLAN_FEATURES[plan] || PLAN_FEATURES.free;
};

export const isPro = (user) => {

  return getUserPlan(user) === "pro";
};

export const hasFeature = (user, feature) => {
  const features = getPlanFeatures(user);

  return Boolean(features[feature]);
};

export const checkLimit = (currentUsage, limit) => {
    if (limit === Infinity) {
        return true;
    }

    return currentUsage < limit;
};
