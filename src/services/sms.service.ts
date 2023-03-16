import { getEnv } from "@app/utils/env";
import client from "twilio";

export const smsClient = client(getEnv("TWILIO_ACCOUNT_SID"), getEnv("TWILIO_AUTH_TOKEN"), {
  logLevel: "debug",
});
