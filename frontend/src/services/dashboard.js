import api from "./api";

export const getDashboard = async ({
  startDate,
  endDate,
} = {}) => {
  const params = new URLSearchParams();

  if (startDate) {
    params.set("startDate", startDate);
  }

  if (endDate) {
    params.set("endDate", endDate);
  }

  const queryString = params.toString();

  return api.get(
    `/dashboard${queryString ? `?${queryString}` : ""}`
  );
};
