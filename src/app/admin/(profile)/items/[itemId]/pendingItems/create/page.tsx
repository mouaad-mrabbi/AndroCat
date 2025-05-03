import FormCPUI from "./FormCPUI";

interface paramsProps {
    params: Promise<{ itemId: string }>;
  }

export default async function createPendingUpdateItem({ params }: paramsProps) {
  const itemId = Number((await params).itemId);

  return (
    <div>
      <FormCPUI itemId={itemId}/>
    </div>
  );
}
