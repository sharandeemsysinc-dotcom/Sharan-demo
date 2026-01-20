import React, { useRef } from "react";
import Otp from "./FormFields.module.scss";

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
}

const InputOtp: React.FC<OtpInputProps> = ({ value, onChange, length = 6 }) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const values = Array.from({ length }, (_, i) => value[i] ?? "");

  const updateIndex = (index: number, newDigit: string) => {
    const newValues = [...values];
    newValues[index] = newDigit;
    onChange(newValues.join(""));
  };

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const digit = e.target.value;

    if (!/^\d*$/.test(digit)) return;

    updateIndex(index, digit);

    if (digit && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");

    if (!pasted) return;

    // Spread pasted digits starting from current box
    const newValues = [...values];

    for (let i = 0; i < pasted.length && index + i < length; i++) {
      newValues[index + i] = pasted[i];
    }

    onChange(newValues.join(""));

    // Focus next empty box
    const nextEmpty = newValues.findIndex((v) => v === "");
    if (nextEmpty !== -1) {
      focusInput(nextEmpty);
    } else {
      // last box
      focusInput(length - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (values[index]) {
        updateIndex(index, "");
      } else if (index > 0) {
        updateIndex(index - 1, "");
        focusInput(index - 1);
      }
      e.preventDefault();
    }
  };

  return (
    <div className={Otp.otpContainer}>
      {values.map((val, idx) => (
        <input
          key={idx}
          type="text"
          maxLength={1}
          ref={(el: any) => (inputsRef.current[idx] = el)}
          value={val}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={(e) => handlePaste(e, idx)}
          className={Otp.otpBox}
        />
      ))}
    </div>
  );
};

export default InputOtp;
