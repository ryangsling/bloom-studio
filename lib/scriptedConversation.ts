import type { Service } from "@/types/salon";

export interface ScriptedMessage {
  role: "user" | "bot";
  text: string;
}

/**
 * The scripted "Hi, do you do X?" demo exchange, generated from whichever
 * service is passed in (normally services[0]) so a re-skinned salon (e.g. a
 * barbershop) never shows another salon's service in its own demo.
 */
export function getScriptedMessages(service: Service): ScriptedMessage[] {
  const name = service.name.toLowerCase();
  return [
    { role: "user", text: `Hi! Do you do ${name}?` },
    {
      role: "bot",
      text: `Hi there! Yes — ${name} is one of our most-loved services here. Want pricing, or shall I check today's availability?`,
    },
    { role: "user", text: "How much is it?" },
    {
      role: "bot",
      text: `${service.name} starts from ${service.price}, including a consultation and finish. Full details are confirmed after a quick chat with a stylist.`,
    },
  ];
}
