import { CartItem } from "@/types/menuOrder.type";

type TotalCardProps = {
  cart: CartItem[];
  getTotalOrderPrice: () => number;
  getTotalOrderItems: () => number;
};
export const TotalCard = ({
  cart,
  getTotalOrderPrice,
  getTotalOrderItems,
}: TotalCardProps) => {
  return (
    <div className="p-4 bg-white  stick bottom-0 rounded-xl shadow-md text-lg font-semibold">
      {cart && (
        <div className="">
          รวมรายการ {getTotalOrderItems()} รวมทั้งหมด: {getTotalOrderPrice()}{" "}
          บาท
        </div>
      )}
    </div>
  );
};
