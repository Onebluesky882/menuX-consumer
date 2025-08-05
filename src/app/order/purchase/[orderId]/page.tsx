import OrderPurchase from "../../../../pre-load/OrderPurchase";

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orderId } = await params;

  return <OrderPurchase orderId={orderId} />;
}
