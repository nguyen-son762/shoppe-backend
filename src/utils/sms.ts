import { smsClient } from "@app/services/sms.service";

export const sendSMS = async (phonenumber: string, body: string) => {
  await smsClient.messages.create({
    to: phonenumber,
    body,
    messagingServiceSid: "MG287a083bafdcc71ebb79f98af4a2ebdc",
  });
};
