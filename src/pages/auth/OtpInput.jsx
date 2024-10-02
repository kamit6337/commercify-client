/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useRef } from "react";

const OtpInput = ({ otp, cb }) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current.length > 0) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (otp.every((item) => item === "")) {
      inputRefs.current[0].focus();
    }
  }, [otp]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    // a regular expression that matches a single digit (0-9) or ""
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      cb(newOtp);

      // Move to next input if not the last input
      if (value && index < 7) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex w-full items-center justify-center gap-2">
      {otp.map((value, index) => {
        return (
          <div
            key={index}
            className="flex h-[48px] w-[46px] items-center justify-center rounded-md border-2 border-slate-200 px-1 text-lg text-black shadow-sm"
          >
            <input
              type="text"
              maxLength={1}
              required={true}
              value={value}
              autoComplete="off"
              spellCheck="false"
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onChange={(e) => handleChange(e, index)}
              className="h-full w-full text-center"
            />
          </div>
        );
      })}
    </div>
  );
};

export default OtpInput;
