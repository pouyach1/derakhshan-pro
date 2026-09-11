import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type CtaTextSectionProps = {
  title: string;
  body: string;
  cta: { href: string; label: string };
  invert?: boolean;
  className?: string;
};

export default function CtaTextSection({ title, body, cta, invert = false, className }: CtaTextSectionProps) {
  return (
    <section
      className={cn(
        "py-section-md",
        invert ? "bg-brand-800 text-beige" : "bg-beige text-brand-800",
        className,
      )}
    >
      <div className="rio-container grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <h2 className={cn("max-w-3xl font-vazirmatn text-h2 font-semibold leading-relaxed normal-case tracking-tight")}>{title}</h2>
          <div className="mt-8">
            <Button href={cta.href} variant={invert ? "yellow" : "primary"} className="font-vazirmatn normal-case tracking-normal">
              {cta.label}
            </Button>
          </div>
        </div>
        <p className={cn("md:col-span-5 font-vazirmatn leading-relaxed md:pt-3", invert ? "text-beige/80" : "text-brand-800/80")}>{body}</p>
      </div>
    </section>
  );
}
