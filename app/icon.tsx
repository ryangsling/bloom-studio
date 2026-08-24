import { ImageResponse } from "next/og";
import salon from "@/config/salon.json";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: salon.accent,
          color: "#FFFDFB",
          fontFamily: "sans-serif",
          fontWeight: 700,
          fontSize: 20,
        }}
      >
        {salon.salonName.charAt(0)}
      </div>
    ),
    size,
  );
}
