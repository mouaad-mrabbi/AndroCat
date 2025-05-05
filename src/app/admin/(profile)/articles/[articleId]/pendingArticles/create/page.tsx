import FormCPUI from "./FormCPUI";

interface paramsProps {
  params: Promise<{ articleId: string }>;
}

//Create Pending Update Article (CPUA)
export default async function pageCPUI({ params }: paramsProps) {
  const articleId = Number((await params).articleId);

  return (
    <div>
      <FormCPUI articleId={articleId} />
    </div>
  );
}
