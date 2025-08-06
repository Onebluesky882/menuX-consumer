import OrderPurchase from "../../../../pre-load/OrderPurchase";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return <OrderPurchase orderId={orderId} />;
}
