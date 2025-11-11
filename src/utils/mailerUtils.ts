import { EmailClient } from "@azure/communication-email";
import { LoggerUtils } from "./loggerUtils";
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING!;
if (!connectionString) {
  LoggerUtils.warn('AZURE_COMMUNICATION_CONNECTION_STRING is not defined in environment variables')
}
const senderAddress = process.env.SENDER_EMAIL_ADDRESS!;
if (!senderAddress) {
  LoggerUtils.warn('SENDER_EMAIL_ADDRESS is not defined in environment variables')
}

export class MailerUtils {
  private static isMailerConfigured(): boolean {
    return Boolean(connectionString && senderAddress);
  }

  static async sendEmail(to: string, subject: string, html: string) {
    if (!this.isMailerConfigured()) {
      LoggerUtils.warn('Skipping email send — mailer not configured.');
      return;
    }
    try {
      const client = new EmailClient(connectionString);

      const message = {
        senderAddress,
        content: {
          subject: subject,
          plainText: "Hi there, this is a test email from Azure Communication Services.",
          html: html,
        },
        recipients: {
          to: [
            {
              address: to,
              displayName: "Jacob Precious",
            },
          ],
        },
      };

      const poller = await client.beginSend(message);
      const result = await poller.pollUntilDone();

      if (result.status === "Succeeded") {
        console.log("Email sent successfully!");
      } else {
        console.error("Email send failed:", result.error);
      }
    } catch (err) {
      console.error("Error sending email:", err);
    }
  }


  static async sendPasswordResetEmail(to: string, subject: string, html: string) {
    if (!this.isMailerConfigured()) {
      LoggerUtils.warn('Skipping email send — mailer not configured.');
      return;
    }
    try {
      const client = new EmailClient(connectionString);

      const message = {
        senderAddress,
        content: {
          subject: subject,
          plainText: "You requested a password reset.",
          html: html,
        },
        recipients: {
          to: [
            {
              address: to,
              displayName: "Recipient",
            },
          ],
        },
      };

      const poller = await client.beginSend(message);
      const result = await poller.pollUntilDone();

      if (result.status === "Succeeded") {
        console.log("Email sent successfully!");
      } else {
        console.error("Email send failed:", result.error);
      }
    } catch (err) {
      console.error("Error sending email:", err);
    }
  }
}