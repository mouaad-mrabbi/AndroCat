'use client';

import { useEffect, useRef, useState } from 'react';

export default function Banner728x90() {
  const containerRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // تابع يقوم بحساب مقياس التصغير حسب عرض الحاوية
  const updateScale = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    const newScale = width / 728;
    setScale(newScale > 1 ? 1 : newScale); // لا نكبره عن 1
  };

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (!adRef.current) return;

    const scriptConfig = document.createElement('script');
    scriptConfig.type = 'text/javascript';
    scriptConfig.innerHTML = `
      atOptions = {
        'key' : '0916e702dcda4948935eb4bd47cd5b6b',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    const scriptAd = document.createElement('script');
    scriptAd.type = 'text/javascript';
    scriptAd.src = '//www.highperformanceformat.com/0916e702dcda4948935eb4bd47cd5b6b/invoke.js';

    adRef.current.innerHTML = '';
    adRef.current.appendChild(scriptConfig);
    adRef.current.appendChild(scriptAd);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-[728px] mx-auto mb-6 px-2">
      <div
        ref={adRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '728px',
          height: '90px',
        }}
      />
    </div>
  );
}
