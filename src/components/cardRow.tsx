interface CardRowProp {
  itemType: "games" | "programs";
}

export default function CardRow({ itemType }: CardRowProp) {
  return (
    <div
      className={`p-8 w-full font-bold uppercase 
        ${itemType === "games" ? "bg-[#68cb5b]" : "bg-[#c44b4b]"}`}
    >
      <h1 className="text-[#343a40]">{itemType}</h1>
      <h2 className="text-[2rem]">Download</h2>
    </div>
  );
}
