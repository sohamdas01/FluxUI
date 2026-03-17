import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree,DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  subsets: ["latin"],
  // weight: ["400", "500", "700"],
  // variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "FluxUI",
  description: "Generated High Quality Free UI/UX Mobile and Web Designs with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body
        className={dmSans.className}
      >
        {children}
      </body>
    </html>
  );
}
