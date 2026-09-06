import api from "./api";

export const getUsage = async () => {
  return api.get("/usage");
};
