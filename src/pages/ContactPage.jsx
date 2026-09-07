import { useState } from "react";
import Button from "../components/ui/Button.jsx";

const FIELDS = [
  { name: "nom", label: "Nom", required: true },
  { name: "prenom", label: "Prénom", required: true },
  { name: "email", label: "E-mail", type: "email", required: true },
  { name: "telephone", label: "Téléphone", type: "tel", required: true, placeholder: "01 00 00 00 00" },
  { name: "societe", label: "Société" },
  { name: "objet", label: "Objet de la demande" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="contact-hero container" style={{ padding: "48px 16px 96px" }}>
      <h1 className="text-xl" style={{ marginBottom: 32 }}>
        Contacter Luxury Places
      </h1>
      {sent ? (
        <p className="text-s">Merci. Votre message a bien été enregistré localement.</p>
      ) : (
        <form
          className="gform_wrapper"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
          style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16, maxWidth: 960 }}
        >
          {FIELDS.map((field) => (
            <label key={field.name} className="gfield_label" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span className="text-3xs" style={{ color: "#666666" }}>
                {field.label}
                {field.required ? " *" : ""}
              </span>
              <input
                className="input large"
                name={field.name}
                type={field.type || "text"}
                required={field.required}
                placeholder={field.placeholder || "Tapez ici"}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cccccc",
                  borderRadius: 3,
                  padding: "8px 12px",
                  color: "#000000",
                  fontSize: 14,
                }}
              />
            </label>
          ))}
          <label className="gfield_label" style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="text-3xs" style={{ color: "#666666" }}>
              Message *
            </span>
            <textarea
              name="message"
              required
              placeholder="Tapez ici"
              rows={6}
              style={{
                background: "#ffffff",
                border: "1px solid #cccccc",
                borderRadius: 3,
                padding: "8px 12px",
                color: "#000000",
                fontSize: 14,
              }}
            />
          </label>
          <label className="text-3xs" style={{ gridColumn: "1 / -1", color: "#666666" }}>
            <input type="checkbox" name="newsletter" style={{ marginRight: 8 }} />
            Je souhaite m’inscrire à la newsletter
          </label>
          <p className="text-3xs" style={{ gridColumn: "1 / -1", color: "#666666" }}>
            En soumettant ce formulaire, j'affirme avoir pris connaissance de la politique de confidentialité.
          </p>
          <div>
            <Button type="submit" text="Envoyer" />
          </div>
        </form>
      )}
    </section>
  );
}
