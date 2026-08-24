import { Resend } from "resend";
import type { BookingDetails } from "@/lib/booking";
import type { CallbackRequest } from "@/lib/callback";

export async function sendBookingEmail(details: BookingDetails): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.error("Resend is not configured — skipping booking email");
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `New booking request: ${details.service}`,
    text: `Name: ${details.name}\nPhone: ${details.phone}\nService: ${details.service}\nPreferred time: ${details.preferredTime}`,
  });

  if (error) {
    console.error(
      `Failed to send booking email: name=${error.name} statusCode=${error.statusCode} message=${error.message}`,
    );
  }
}

export async function sendCallbackRequestEmail(details: CallbackRequest): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.error("Resend is not configured — skipping callback request email");
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: "New callback request",
    text: `Name: ${details.name}\nPhone: ${details.phone}\n\nThis customer asked to be connected with a real person during a chat session.`,
  });

  if (error) {
    console.error(
      `Failed to send callback request email: name=${error.name} statusCode=${error.statusCode} message=${error.message}`,
    );
  }
}
