import FormUpdatePendingItem from "./FormUpdateItem";

interface paramsProps {
  params: Promise<{ pendingItemId: string }>;
}

export default async function updatePendingItem({ params }: paramsProps) {
  const { pendingItemId } = await params;
  return (
    <div>
      <FormUpdatePendingItem pendingItemId={pendingItemId} />
    </div>
  );
}
