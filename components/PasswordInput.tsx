import { useState } from "react";
import Image from "next/image";

type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
};

const PasswordInput = ({
  value,
  onChange,
  onKeyDown,
  placeholder = "Enter your password",
  required = false,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(v => !v);

  return (
    <div className="relative">
      <input
        className="w-full pr-12 text-xs"
        type={showPassword ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800"
        onClick={togglePasswordVisibility}
        tabIndex={-1}
      >
        {showPassword ? (
          <Image src="/images/icon/eye-open.svg" alt="eye-open" width={24} height={24} />
        ) : (
          <Image src="/images/icon/eye-close.svg" alt="eye-close" width={24} height={24} />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
