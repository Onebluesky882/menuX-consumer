import { CartItem, OrderPayload } from "@/types/menuOrder.type";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { FaCartShopping } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { Button } from "../ui/button";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
type CartIconPreviewProps = {
  getTotalOrderItems: () => number;
  setPreviewCart: () => void;
};

type CartPreviewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  totalOrdersPrice: () => number;
  handleStoreOrders: (orders: OrderPayload) => void;
  increaseQuantity: (option: string) => void;
  decreaseQuantity: (option: string) => void;
  shopId: string;
};

export const CartPreview = ({
  cart,
  open,
  onOpenChange,
  totalOrdersPrice,
  handleStoreOrders,
  increaseQuantity,
  decreaseQuantity,
  shopId,
}: CartPreviewProps) => {
  // Step 1: Group by menuName
  const groupedByMenuName = cart.reduce<
    Record<
      string,
      {
        menuName: string;
        menuId: string;
        options: CartItem[];
      }
    >
  >((acc, item) => {
    if (!acc[item.menuId]) {
      acc[item.menuId] = {
        menuId: item.menuId,
        menuName: item.menuName,
        options: [item],
      };
    } else {
      acc[item.menuId].options.push(item);
    }

    return acc;
  }, {});

  const groupedCartArray = Object.values(groupedByMenuName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-50 fixed bottom-0 left-0 right-0 max-h-[70vh] w-full rounded-t-2xl bg-white p-6 shadow-xl border-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <DialogTitle className="text-xl font-bold text-gray-800">
            🛒 ตะกร้าสินค้า
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <IoCloseCircle size={36} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 overflow-y-auto max-h-[40vh] pr-2">
          {groupedCartArray.length === 0 ? (
            <p className="text-center text-gray-500">ไม่มีสินค้าในตะกร้า</p>
          ) : (
            groupedCartArray.map((group, index) => (
              <div
                key={group.menuId}
                className="bg-white border rounded-xl p-4 shadow-sm"
              >
                <div className="text-xl font-bold text-gray-700 mb-2">
                  {index + 1}. {group.menuName}
                </div>

                {group.options.map((option) => (
                  <div
                    key={option.optionId}
                    className="flex mt-2 justify-between text-md text-gray-600 pl-4"
                  >
                    {" "}
                    <div>
                      • {option.selectedOption.label} x {option.quantity}
                    </div>
                    <div className=" flex gap-2 items-center  font-semibold">
                      <FaCirclePlus
                        onClick={() => increaseQuantity(option.optionId)}
                        size={24}
                        className="text-[#9a9a9a] active:text-[#6bab5b] transition-colors  duration-75"
                      />
                      <span className="text-green-600 text-xl ">
                        {option.totalPrice.toLocaleString()} บาท
                      </span>
                      <FaCircleMinus
                        onClick={() => decreaseQuantity(option.optionId)}
                        size={24}
                        className="text-[#9a9a9a]  active:text-[#ea3456] transition-colors  duration-75"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Summary & Action */}
        <div className="    flex justify-between items-center mt-6 text-lg font-semibold">
          <span className="text-gray-700 text-xl">รวมทั้งหมด:</span>

          <span className="text-green-600 mr-5">
            {totalOrdersPrice().toLocaleString()} บาท
          </span>
        </div>

        <Button
          className="w-full   mt-4 bg-green-500 hover:bg-green-600 text-white text-lg py-5 rounded-xl transition-all"
          disabled={cart.length === 0}
          onClick={() => {
            const payload = {
              shopId: shopId,
              items: cart.map((menu) => ({
                menuId: menu.menuId,
                quantity: menu.quantity,
                priceEach: menu.basePrice,
                totalPrice: menu.totalPrice,
              })),
            };
            handleStoreOrders(payload);
          }}
        >
          ดำเนินการสั่งซื้อ
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export const CartIconPreview = ({
  getTotalOrderItems,
  setPreviewCart,
}: CartIconPreviewProps) => {
  return (
    <div className="relative flex justify-end p-2  ">
      <div
        onClick={() => setPreviewCart()}
        className="   bg-amber-200   flex justify-center flex-col px-10 py-6 rounded-full "
      >
        <span className="font-extrabold text-2xl  text-center ">
          {getTotalOrderItems()}
        </span>
        <FaCartShopping size={32} />
      </div>
    </div>
  );
};
