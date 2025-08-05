type Props = {
  params: { orderId: string };
};

export default function Page({ params }: Props) {
  const { orderId } = params;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">คำสั่งซื้อของคุณ</h1>
          <p className="text-sm text-gray-500">
            หมายเลขคำสั่งซื้อ:{" "}
            <span className="font-medium text-gray-700">{orderId}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-700">🍔 เบอร์เกอร์หมู</span>
            <span className="text-gray-800 font-medium">฿89</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">🥤 โค้กเย็น</span>
            <span className="text-gray-800 font-medium">฿25</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold text-lg">
            <span>รวม</span>
            <span>฿114</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-yellow-600 font-medium animate-pulse">
            ⏳ กำลังเตรียมอาหารของคุณ...
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow"
          >
            กลับหน้าแรก
          </button>
        </div>
      </div>
    </div>
  );
}
