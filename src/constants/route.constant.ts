const ROOT_ENDPOINT = "/api";

export const authEndpoints = {
  AUTH: `${ROOT_ENDPOINT}/auth`,
  LOGIN: "/login",
  REGISTER: "/register",
  UPDATE: "/update",
  LOGIN_WITH_PLATFORM: "/platform",
  VERIFY: "/verify",
  REGISTER_BY_PHONE_NUMBER: "/register/phone",
};

export const productEndpoints = {
  PRODUCT: `${ROOT_ENDPOINT}/product`,
  CREATE: "/create",
  GET: "/",
  RECOMMEND: "/recommend",
};

export const orderEndpoints = {
  ORDER: `${ROOT_ENDPOINT}/order`,
  GET: "/:user_id",
  CREATE: "/create",
  PURCHASE: "/purchase",
};
