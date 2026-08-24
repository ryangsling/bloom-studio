import type { Metadata } from "next";
import { Newsreader, Karla } from "next/font/google";
import salon from "@/config/salon.json";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${salon.salonName} — ${salon.area}'s hair & beauty studio`,
  description: `Book direct with ${salon.salonName}, no marketplace commission. Colour, cut & finish, nails and brows in ${salon.area}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${karla.variable}`}
      style={{ "--accent": salon.accent } as React.CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
