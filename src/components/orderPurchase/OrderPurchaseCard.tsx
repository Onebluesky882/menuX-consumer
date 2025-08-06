type GroupMenuProps = {
  groupedItems: GroupedMenuItem[];
};
const OrderPurchaseCard = () => {
  return (
    <div className="divide-y divide-gray-200">
      {groupMenu(orderPurchase.orderItems).map((groupItem, index) => (
        <div key={index} className="py-3">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{groupItem.name}</p>
              <p className="text-sm text-gray-500">
                {groupItem.menuOption.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">x{groupItem.quantity}</p>
              <p className="text-sm font-medium text-gray-800">
                ฿{groupItem.totalPrice}
              </p>
            </div>
          </div>
          <p className="text-[12px] text-gray-500">
            {groupItem.statuses.has("pending") && "Cooking..."}
          </p>
        </div>
      ))}
    </div>
  );
};
export default OrderPurchaseCard;
