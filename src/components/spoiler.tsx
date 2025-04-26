"use client";
import { useEffect, useRef, useState } from "react";
import { RiPlayListAddLine } from "react-icons/ri";
import { GrTextAlignFull } from "react-icons/gr";

interface Props {
  description: string;
  title: string;
  isMod: boolean;
  typeMod?: string;
}

export default function Spoiler({ title, description, isMod, typeMod }: Props) {
  const [vanish, setVanish] = useState<string>("hidden");

  const textRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);
  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const checkClamping = () => {
      setIsClamped(element.scrollHeight > element.clientHeight);
    };

    // Initial check on load
    checkClamping();

    // Watch for size changes
    const resizeObserver = new ResizeObserver(checkClamping);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div>
      <p
        itemProp="description"
        ref={textRef}
        className={
          vanish === "hidden"
            ? "line-clamp-4 font-bold"
            : "line-clamp-none font-bold"
        }
      >
        {title} {isMod && <span>({typeMod})</span>}{" "}
        <span className="font-normal ">{description}</span>
      </p>
      <button
        className={isClamped || vanish === "visible" ? " block" : "hidden"}
        onClick={() => {
          vanish === "hidden" ? setVanish("visible") : setVanish("hidden");
        }}
      >
        {vanish === "hidden" ? (
          <div className="flex items-center gap-2 text-green-500">
            <RiPlayListAddLine />
            <span>Full description</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-500">
            <GrTextAlignFull />
            <span>Hide description</span>
          </div>
        )}
      </button>
    </div>
  );
}
