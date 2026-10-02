import { Vazirmatn } from "next/font/google";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import IntroShell from "@/components/providers/IntroShell";
import MobileMotionRoot from "@/components/mobile/MobileMotionRoot";
import MobilePageTransition from "@/components/mobile/MobilePageTransition";

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
        <MobileMotionRoot>
          <Navbar />
          <main>
            <MobilePageTransition>{children}</MobilePageTransition>
          </main>
          <Footer />
        </MobileMotionRoot>
      </IntroShell>
    </div>
  );
}
