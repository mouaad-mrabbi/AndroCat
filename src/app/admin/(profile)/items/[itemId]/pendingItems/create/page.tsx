import FormCreatePendingUpdateItem from "./FormCreatePendingUpdateItem";

interface paramsProps {
    params: Promise<{ itemId: string }>;
  }

export default async function createPendingUpdateItem({ params }: paramsProps) {
  const { itemId } = await params;

  return (
    <div>
      <FormCreatePendingUpdateItem itemId={itemId}/>
    </div>
  );
}
