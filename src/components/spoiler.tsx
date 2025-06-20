"use client";
import { useState } from "react";
import { RiPlayListAddLine } from "react-icons/ri";
import { GrTextAlignFull } from "react-icons/gr";

interface Props {
  title: string;
  secondTitle?: string | null;
  description: string;
  isMod: boolean;
  typeMod?: string;
  paragraphs?: {
    title?: string|null;
    content: string;
  }[];
}

export default function Spoiler({
  title,
  secondTitle,
  description,
  isMod,
  typeMod,
  paragraphs,
}: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <div
        className={`transition-all duration-300 ${
          !expanded ? "line-clamp-4 overflow-hidden" : ""
        }`}
      >
        <p className="text-justify">
          <strong className="font-bold">
            {title}
            {secondTitle && secondTitle} ({isMod && typeMod})
          </strong>{" "}
          - <span>{description}</span>
        </p>

        {paragraphs?.map((p, index) => (
          <div key={index} className="mt-4">
            {p.title && (
              <h2 className="mb-2 text-2xl font-bold max-[770px]:text-xl text-center">
                {p.title}
              </h2>
            )}
            <p className="text-justify">{p.content}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-interactive flex items-center gap-2"
      >
        {expanded ? (
          <>
            <GrTextAlignFull /> Hide description
          </>
        ) : (
          <>
            <RiPlayListAddLine /> Full description
          </>
        )}
      </button>
    </div>
  );
}
