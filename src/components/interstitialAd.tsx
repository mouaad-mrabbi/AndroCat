'use client';

import { useEffect } from 'react';

export default function InterstitialAd() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://groleegni.net/401/9251440';
    script.async = true;

    try {
      document.body.appendChild(script);
    } catch (e) {
      console.error("Failed to inject interstitial ad script:", e);
    }
  }, []);

  return null;
}
