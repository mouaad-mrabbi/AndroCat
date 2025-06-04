"use client";
import { useEffect, useRef, useState } from "react";
import { RiPlayListAddLine } from "react-icons/ri";
import { GrTextAlignFull } from "react-icons/gr";

interface Props {
  description: string;
  title: string;
  isMod: boolean;
  typeMod?: string;
  paragraphs?: {
    title?: string;
    content: string;
  }[];
}

export default function Spoiler({
  title,
  description,
  isMod,
  typeMod,
  paragraphs,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={`transition-all duration-300 ${
          !expanded ? "line-clamp-4 overflow-hidden" : ""
        }`}
      >
        <p className="font-bold text-justify">
          {title} {isMod && <span>({typeMod})</span>}{" "}
          <span className="font-normal">{description}</span>
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
        className="mt-2 text-green-500 flex items-center gap-2"
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
