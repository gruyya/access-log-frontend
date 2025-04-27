import { useState, useRef, useCallback, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const useRecaptcha = () => {
  const [capchaToken, setCapchaToken] = useState<string>('');
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const handleRecaptcha = useCallback((token: string | null) => {
    setCapchaToken(token || '');
  }, []);

  useEffect(() => {
    const refreshCaptcha = () => {
      if (recaptchaRef.current && capchaToken) {
        recaptchaRef.current.reset();
        setCapchaToken('');
      }
    };

    let tokenRefreshTimeout: NodeJS.Timeout | null = null;

    if (capchaToken) {
      tokenRefreshTimeout = setTimeout(refreshCaptcha, 110000); // 110 seconds
    }

    return () => {
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout);
      }
    };
  }, [capchaToken]);

  return { capchaToken, setCapchaToken, recaptchaRef, handleRecaptcha };
};

export default useRecaptcha;

// In this hook, we define the following:

// capchaToken: Stores the current reCAPTCHA token.
// recaptchaRef: A ref to the reCAPTCHA component.
// handleRecaptcha: A callback function to handle the reCAPTCHA response.
// An effect that automatically refreshes the reCAPTCHA token after 110 seconds (capchaToken will automatically expire in 2 minutes).
