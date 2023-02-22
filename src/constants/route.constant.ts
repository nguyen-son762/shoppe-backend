const ROOT_ENDPOINT = "/api";

export const authEndpoints = {
  AUTH: `${ROOT_ENDPOINT}/auth`,
  LOGIN: "/login",
  REGISTER: "/register",
  UPDATE: "/update",
  LOGIN_WITH_PLATFORM: "/platform",
  VERIFY: "/verify",
};

export const productEndpoints = {
  PRODUCT: `${ROOT_ENDPOINT}/product`,
  CREATE: "/create",
  GET: "/",
};
