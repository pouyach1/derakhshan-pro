"use client";

import IntroProvider from "@/components/providers/IntroProvider";
import PageLoader from "@/components/ui/PageLoader";

export default function IntroShell({ children }: { children: React.ReactNode }) {
  return (
    <IntroProvider>
      <PageLoader />
      {children}
    </IntroProvider>
  );
}
