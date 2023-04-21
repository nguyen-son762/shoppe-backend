const ROOT_ENDPOINT = "/api";

export const authEndpoints = {
  AUTH: `${ROOT_ENDPOINT}/auth`,
  LOGIN: "/login",
  REGISTER: "/register",
  UPDATE: "/update",
  LOGIN_WITH_PLATFORM: "/platform",
  VERIFY: "/verify",
  REGISTER_BY_PHONE_NUMBER: "/register/phone",
  LIKED: "/liked",
  TOTAL: '/total',
  LIST: '/list'
};

export const productEndpoints = {
  PRODUCT: `${ROOT_ENDPOINT}/product`,
  CREATE: "/create",
  GET: "/",
  RECOMMEND: "/recommend",
  GET_BY_ID: '/detail/:product_id'
};

export const orderEndpoints = {
  ORDER: `${ROOT_ENDPOINT}/order`,
  GET: "/:user_id",
  GET_ALL: "/",
  CREATE: "/create",
  PURCHASE: "/purchase",
  GET_STATUS: "/status/:user_id",
  UPDATE: "/status/:user_id",
};
