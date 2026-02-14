import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type FieldError } from "react-hook-form";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

const INPUT_CLASS =
  "block w-full bg-white border border-indigo-200 rounded-md px-3 py-2 sm:text-sm text-gray-800 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 shadow-sm disabled:bg-gray-50 disabled:text-gray-500";

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={className}>
        <label
          htmlFor={props.id}
          className="block text-sm font-semibold text-gray-800 mb-1"
        >
          {label}
        </label>
        <input
          ref={ref}
          className={twMerge(
            clsx(
              INPUT_CLASS,
              error && "border-red-400 focus:border-red-400 focus:ring-red-200",
            ),
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
