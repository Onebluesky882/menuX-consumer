type OrderSummary = {
  optionLabel: string;
  totalQuantity: number;
  totalPrice: number;
};

type GroupedOrderItems = Record<string, Record<string, OrderSummary>>;

type RenderOrderItemsProps = {
  grouped: GroupedOrderItems;
  totalPrice: number;
};

const RenderOrderItems = ({ grouped, totalPrice }: RenderOrderItemsProps) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">รายการอาหาร</h2>
    {Object.entries(grouped).map(([menuName, prices], index) => (
      <div key={`${menuName}-${index}`} className="mb-4">
        <h3 className="font-bold text-xl text-gray-700 mb-1">{menuName}</h3>
        <ul className="ml-4 space-y-1 text-lg">
          {Object.entries(prices).map(([price, summary], i) => (
            <li key={`${price}-${i}`} className="flex justify-between py-1">
              <span>
                {summary.optionLabel} × {summary.totalQuantity}
              </span>
              <span>{summary.totalPrice.toFixed(2)} ฿</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
    <div className="border-t pt-4 mt-4 text-right text-2xl font-bold">
      รวมทั้งสิ้น: <span className="text-green-600">{totalPrice} ฿</span>
    </div>
  </div>
);

export default RenderOrderItems;
