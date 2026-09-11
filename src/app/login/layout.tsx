import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-login",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Login | Havenix",
  description: "Welcome back — login to browse thousands of properties with trusted agents.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="ltr"
      lang="en"
      className={`${inter.variable} ${inter.className} min-h-dvh bg-[#F0F4F8] text-slate-900 antialiased`}
    >
      {children}
    </div>
  );
}
