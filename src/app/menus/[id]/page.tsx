import ShopMenus from "@/pre-load/ShopMenus";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <ShopMenus shopId={id} />;
    </div>
  );
}
