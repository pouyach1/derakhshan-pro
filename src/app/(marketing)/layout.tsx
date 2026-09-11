import { Vazirmatn } from "next/font/google";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import IntroShell from "@/components/providers/IntroShell";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      lang="fa"
      className={`${vazirmatn.variable} ${vazirmatn.className} font-vazirmatn antialiased`}
    >
      <IntroShell>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </IntroShell>
    </div>
  );
}
