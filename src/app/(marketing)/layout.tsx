import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import IntroShell from "@/components/providers/IntroShell";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <IntroShell>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </IntroShell>
  );
}
