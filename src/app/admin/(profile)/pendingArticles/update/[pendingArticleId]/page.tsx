import FormUPA from "./FormUPA";

interface paramsProps {
  params: Promise<{ pendingArticleId: string }>;
}

// Update Pending Article (UPA)
export default async function pageUPA({ params }: paramsProps) {
  const { pendingArticleId } = await params;
  return (
    <div>
      <FormUPA pendingArticleId={Number(pendingArticleId)} />
    </div>
  );
}
