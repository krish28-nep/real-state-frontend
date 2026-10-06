import UnitDetailContent from "@/components/public/propertyPage/UnitDetailContent";

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string; unitId: string }>;
}) {
  const { propertyId, unitId } = await params;

  return <UnitDetailContent propertyId={Number(propertyId)} unitId={Number(unitId)} />;
}
