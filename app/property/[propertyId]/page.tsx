import PropertyDetailContent from "@/components/public/propertyPage/PropertyDetailContent";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  return <PropertyDetailContent propertyId={Number(propertyId)} />;
}
