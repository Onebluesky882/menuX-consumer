import Order from "@/pre-load/Order";

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <div>
      <Order orderId={orderId} />
    </div>
  );
}
