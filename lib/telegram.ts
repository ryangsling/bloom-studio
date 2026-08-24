import type { BookingDetails } from "@/lib/booking";

export async function sendBookingTelegram(details: BookingDetails): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram is not configured — skipping booking notification");
    return;
  }

  const text = `New booking request\nName: ${details.name}\nPhone: ${details.phone}\nService: ${details.service}\nPreferred time: ${details.preferredTime}`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!res.ok) {
    console.error("Failed to send Telegram notification", await res.text());
  }
}
