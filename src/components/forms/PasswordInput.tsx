"use client";

import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
>(
  ({ label, placeholder, error, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          label={label}
          placeholder={placeholder}
          error={error}
          className={className}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
          style={{ top: label ? "38px" : "10px" }}
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
