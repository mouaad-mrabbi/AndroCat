import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
interface propsType {
  local: string;
  firstLocal: string;
  scndLocal?: string;
}

export default function Toolbar({
  local,
  firstLocal,
  scndLocal = "",
}: propsType) {
  return (
    <div className="flex items-center gap-2 px-8 py-4 border-b border-[#2a2c2e] text-sm">
      <Link
        title="AndroCat"
        href={local === "home" ? "/" : `/admin/${local}`}
        className="text-green-500"
      >
        {local === "home" ? "home" : local}
      </Link>
      <BsArrowRight />
      {scndLocal !== "" ? (
        <Link
          title={`${firstLocal}`}
          href={
            local === "home" ? `/${firstLocal}` : `/admin/${firstLocal}/page/1`
          }
          className="text-green-500"
        >
          {firstLocal}
        </Link>
      ) : (
        <p className="text-[#b6bec5]">{firstLocal}</p>
      )}

      {scndLocal !== "" && <BsArrowRight />}
      {scndLocal !== "" && <p className="text-[#b6bec5]">{scndLocal}</p>}
    </div>
  );
}
