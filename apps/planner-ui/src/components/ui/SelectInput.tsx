import { forwardRef, type SelectHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type FieldError } from "react-hook-form";

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: FieldError;
  options: readonly string[] | string[];
  getLabel?: (value: string) => string;
}

const SELECT_CLASS =
  "block w-full bg-white border border-indigo-200 rounded-md px-3 py-2 pr-8 sm:text-sm text-gray-800 transition-shadow appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 shadow-sm";

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, error, options, getLabel, className, ...props }, ref) => {
    return (
      <div className={className}>
        <label
          htmlFor={props.id}
          className="block text-sm font-semibold text-gray-800 mb-1"
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={twMerge(
              clsx(
                SELECT_CLASS,
                error &&
                  "border-red-400 focus:border-red-400 focus:ring-red-200",
              ),
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {getLabel ? getLabel(opt) : opt}
              </option>
            ))}
          </select>
          {/* Custom Arrow Icon */}
          <svg
            className="pointer-events-none absolute inset-y-0 left-2 h-5 w-5 text-indigo-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
          </svg>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    );
  },
);

SelectInput.displayName = "SelectInput";
