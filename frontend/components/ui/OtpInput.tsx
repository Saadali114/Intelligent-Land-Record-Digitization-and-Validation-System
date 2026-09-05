'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface OtpInputProps {
  length?: number;
  email?: string;
  mobile?: string;
  onComplete: (otp: string) => void;
  onResend: () => Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
  resendCooldownSeconds?: number;
  expirySeconds?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  email,
  mobile,
  onComplete,
  onResend,
  isLoading = false,
  errorMessage = null,
  resendCooldownSeconds = 60,
  expirySeconds = 300,
}) => {

  const { t } = useTranslation();
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const [cooldown, setCooldown] = useState<number>(resendCooldownSeconds);
  const [timeLeft, setTimeLeft] = useState<number>(expirySeconds);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Expiry countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    // Only accept numeric characters
    const numeric = value.replace(/\D/g, '');
    if (!numeric) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const char = numeric.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance to next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger complete callback when all digits are entered
    if (newDigits.every((d) => d.length === 1)) {
      onComplete(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < length; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setDigits(newDigits);

    const focusIdx = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIdx]?.focus();

    if (newDigits.every((d) => d.length === 1)) {
      onComplete(newDigits.join(''));
    }
  };

  const handleResendClick = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      await onResend();
      setCooldown(resendCooldownSeconds);
      setTimeLeft(expirySeconds);
      setDigits(Array(length).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsResending(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Mask target (email or mobile) for privacy
  const formatMaskedTarget = () => {
    if (email) {
      const parts = email.split('@');
      if (parts.length === 2) {
        const [username, domain] = parts;
        const visibleStart = username.slice(0, 2);
        const visibleEnd = username.length > 3 ? username.slice(-1) : '';
        return `${visibleStart}***${visibleEnd}@${domain}`;
      }
      return email;
    }
    if (mobile) {
      const digitsOnly = mobile.replace(/\D/g, '');
      if (digitsOnly.length >= 10) {
        const last4 = digitsOnly.slice(-4);
        return `+91 ******${last4}`;
      }
      return mobile;
    }
    return '';
  };

  const isEmailMode = Boolean(email);

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="text-center space-y-1">
        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">
          {isEmailMode
            ? t('auth.verifyEmail', { defaultValue: 'Verify Email Address' })
            : t('auth.verifyMobile', { defaultValue: 'Verify Mobile Number' })}
        </h3>
        <p className="text-xs text-slate-500">
          {t('auth.otpSent', { defaultValue: 'We sent a 6-digit verification code to' })}{' '}
          <span className="font-mono font-semibold text-slate-800">{formatMaskedTarget()}</span>
        </p>
      </div>


      {/* 6-Box Inputs */}
      <div>
        <div className="flex justify-center items-center gap-2 sm:gap-3">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              disabled={isLoading || timeLeft <= 0}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${idx + 1}`}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-lg border border-slate-300 bg-white text-slate-900 shadow-xs transition-all focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
            />
          ))}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-center justify-center gap-1.5 mt-3 text-xs font-medium text-rose-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Expiry & Resend Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs border-t border-slate-100 pt-3">
        <div className="text-slate-500">
          {timeLeft > 0 ? (
            <span>
              {t('auth.codeExpiresIn', { defaultValue: 'Code expires in' })}{' '}
              <strong className="font-mono text-slate-800">{formatTimer(timeLeft)}</strong>
            </span>
          ) : (
            <span className="text-rose-600 font-medium">
              {t('auth.otpExpired', { defaultValue: 'OTP expired. Please request a new code.' })}
            </span>
          )}
        </div>

        <div>
          {cooldown > 0 ? (
            <span className="text-slate-400">
              {t('auth.resendOtp', { defaultValue: 'Resend OTP' })} ({cooldown}s)
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendClick}
              disabled={isResending || isLoading}
              className="font-semibold text-blue-900 hover:text-blue-700 hover:underline flex items-center gap-1 focus:outline-none disabled:opacity-50"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('auth.sendingOtp', { defaultValue: 'Sending OTP...' })}</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t('auth.resendOtp', { defaultValue: 'Resend OTP' })}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
