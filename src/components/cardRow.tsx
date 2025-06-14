interface CardRowProp {
  articleType: "games" | "programs";
}

export default function CardRow({ articleType }: CardRowProp) {
  return (
    <div
      className={`p-8 w-full font-bold uppercase 
        ${articleType === "games" ? "bg-interactive" : "bg-[#cb5b5b]"}`}
    >
      <h1 className="text-[#343a40]">{articleType}</h1>
      <h2 className="text-[2rem]">Download</h2>
    </div>
  );
}
