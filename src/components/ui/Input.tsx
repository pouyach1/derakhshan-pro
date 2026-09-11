import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function UnderlineInput({ label, className, id, ...props }: InputProps) {
  const inputId = id || props.name || label.replace(/\s+/g, "-");
  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="font-vazirmatn text-sm text-beige/70">{label}</span>
      <input
        id={inputId}
        className={cn(
          "w-full border-0 border-b border-beige/20 bg-transparent py-3 font-vazirmatn text-base text-mist-200 outline-none transition-colors duration-300 placeholder:text-mist-300 focus:border-yellow-500",
          className,
        )}
        {...props}
      />
    </label>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function UnderlineTextarea({ label, className, id, ...props }: TextAreaProps) {
  const inputId = id || props.name || label.replace(/\s+/g, "-");
  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="font-vazirmatn text-sm text-beige/70">{label}</span>
      <textarea
        id={inputId}
        className={cn(
          "min-h-28 w-full resize-y border-0 border-b border-beige/20 bg-transparent py-3 font-vazirmatn text-base text-mist-200 outline-none transition-colors duration-300 placeholder:text-mist-300 focus:border-yellow-500",
          className,
        )}
        {...props}
      />
    </label>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
};

export function UnderlineSelect({ label, options, className, id, ...props }: SelectProps) {
  const inputId = id || props.name || label.replace(/\s+/g, "-");
  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="font-vazirmatn text-sm text-beige/70">{label}</span>
      <select
        id={inputId}
        className={cn(
          "w-full appearance-none border-0 border-b border-beige/20 bg-transparent py-3 font-vazirmatn text-base text-mist-200 outline-none transition-colors duration-300 focus:border-yellow-500",
          className,
        )}
        {...props}
      >
        <option value="">در حال بررسی گزینه‌ها هستم...</option>
        {options.map((option) => (
          <option key={option} value={option} className="text-brand-800">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
