import { smsClient } from "../services/sms.service";
import { getEnv } from "./env";

export const sendSMS = async (phonenumber: string, body: string) => {
  await smsClient.messages.create({
    to: phonenumber,
    body,
    messagingServiceSid: getEnv("TWILIO_MESSAGING_SERVICE_ID"),
  });
};
