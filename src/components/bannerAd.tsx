'use client';

import { useEffect, useRef, useState } from 'react';

type AdProps = {
  adKey: string;
  width: number;
  height: number;
  delay?: number; // ← تأخير اختياري
};

export default function BannerAd({ adKey, width, height, delay = 0 }: AdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [shouldRender, setShouldRender] = useState(delay === 0); // فقط يرندر إذا delay صفر

  const updateScale = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const newScale = containerWidth / width;
    setScale(newScale > 1 ? 1 : newScale);
  };

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // تأخير العرض
  useEffect(() => {
    if (delay === 0) return;
    const timer = setTimeout(() => setShouldRender(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!shouldRender || !adRef.current) return;

    const scriptConfig = document.createElement("script");
    scriptConfig.type = "text/javascript";
    scriptConfig.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const scriptAd = document.createElement("script");
    scriptAd.type = "text/javascript";
    scriptAd.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;

    adRef.current.innerHTML = '';
    adRef.current.appendChild(scriptConfig);
    adRef.current.appendChild(scriptAd);
  }, [shouldRender, adKey, width, height]);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      className="w-full mx-auto "
      style={{ maxWidth: `${width}px` }}
    >
      <div
        ref={adRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  );
}


