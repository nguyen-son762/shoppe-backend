import client from "twilio";

export const smsClient = client(
  "AC58bea04c3e230162e5b032e13ecbebaf",
  "b662f1b4a5bfb4ab54ab1e38b845c129",
  {
    logLevel: "debug",
  }
);
