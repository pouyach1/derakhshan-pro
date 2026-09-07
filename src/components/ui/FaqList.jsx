import { useState } from "react";

export default function FaqList({ items }) {
  const [open, setOpen] = useState(null);

  return (
    <ul className="faq-list">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <li className="faq-item disclosure" key={item.q}>
            <button
              type="button"
              aria-expanded={expanded}
              className="disclosure-header text-2xs"
              onClick={() => setOpen(expanded ? null : index)}
            >
              {item.q}
              <svg
                aria-hidden="true"
                className="disclosure-header-icon disclosure-header-icon--closed icon"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path d="M8.5 7.5H15V8.5H8.5V15H7.5V8.5H1V7.5H7.5V1H8.5V7.5Z" fill="black" />
              </svg>
            </button>
            <div className="disclosure-wrapper" hidden={!expanded}>
              <div className="disclosure-inner">
                <div className="disclosure-content">
                  <div className="cms">
                    {item.a.split("\n").map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
