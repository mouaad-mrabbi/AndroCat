'use client';

import { useEffect } from 'react';

export default function InterstitialAd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//pl26464108.profitableratecpm.com/07/1f/b9/071fb963ee54cd30e26df50edc7fb229.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // تنظيف عند إزالة المكون
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
