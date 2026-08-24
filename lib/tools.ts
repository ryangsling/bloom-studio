export const CAPTURE_BOOKING_TOOL = {
  type: "function",
  function: {
    name: "capture_booking",
    description:
      "Record a booking request with the customer's details. Only call this once the customer has confirmed all four fields — this is the only way a booking is captured, never claim a booking succeeded in prose.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer's name" },
        phone: { type: "string", description: "Customer's phone number" },
        service: { type: "string", description: "The service being booked" },
        preferred_time: { type: "string", description: "Customer's preferred date/time" },
      },
      required: ["name", "phone", "service", "preferred_time"],
    },
  },
} as const;

export const REQUEST_HANDOFF_TOOL = {
  type: "function",
  function: {
    name: "request_handoff",
    description:
      "Escalate to a human stylist when a question is out of scope, you are not confident in the answer, or it touches allergy/patch-test/treatment-safety topics. This is the only way to trigger the hand-off — never claim a hand-off happened in prose.",
    parameters: {
      type: "object",
      properties: {
        reason: { type: "string", description: "Short reason for the hand-off" },
      },
      required: ["reason"],
    },
  },
} as const;
