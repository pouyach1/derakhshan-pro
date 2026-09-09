"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import { UnderlineInput, UnderlineSelect, UnderlineTextarea } from "@/components/ui/Input";
import { SITE } from "@/config/site";

const INTERESTS = [
  "To lease a space",
  "To buy a property",
  "To list an asset",
  "For strategic advisory",
] as const;

const CATEGORIES = ["Retail", "Industrial", "Office", "Mixed-Use"] as const;

export default function ContactFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const toggleCategory = (value: string) => {
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  return (
    <section id="contact" className="bg-brand-500 py-section-md text-beige">
      <div className="rio-container grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="font-display text-[clamp(3.5rem,8vw,6.5rem)] uppercase leading-none tracking-tight text-yellow-500">
            Let&apos;s Talk
          </h2>
          <p className="mt-4 text-lg text-beige/90">Tell us what you&apos;re looking for</p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-10 inline-flex items-center gap-3 font-display text-2xl uppercase tracking-tight text-yellow-500 transition-colors duration-300 hover:text-beige"
          >
            {SITE.email} <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="md:col-span-7">
          {submitted ? (
            <p className="font-display text-3xl uppercase tracking-tight text-yellow-500">
              Thanks for your message. We&apos;ll be in touch soon!
            </p>
          ) : (
            <form className="space-y-8" onSubmit={onSubmit}>
              <p className="text-sm uppercase tracking-wide text-beige/70">Contact Details</p>
              <div className="grid gap-6 md:grid-cols-2">
                <UnderlineInput label="Name" name="name" required placeholder="Your name" />
                <UnderlineInput
                  label="Email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                />
              </div>
              <UnderlineInput label="Phone" name="phone" type="tel" placeholder="+27 ..." />
              <UnderlineSelect label="Interest" name="interest" options={[...INTERESTS]} />

              <fieldset>
                <legend className="text-sm uppercase tracking-wide text-beige/70">
                  Across (Select all that apply)
                </legend>
                <div className="mt-4 flex flex-wrap gap-3">
                  {CATEGORIES.map((category) => {
                    const active = categories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={
                          active
                            ? "rounded-pill border border-yellow-500 bg-yellow-500 px-4 py-2 text-sm uppercase text-brand-800"
                            : "rounded-pill border border-beige/30 px-4 py-2 text-sm uppercase text-beige transition-colors duration-300 hover:border-yellow-500 hover:text-yellow-500"
                        }
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <UnderlineTextarea
                label="Message"
                name="message"
                placeholder="Anything else to share?"
              />

              <Button type="submit" variant="yellow">
                Send
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
