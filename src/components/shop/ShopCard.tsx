import Image from "next/image";
import { MenuItem } from "../../types/menuOrder.type";
export type Shop = {
  name: string;
};

export type MenuImage = {
  imageUrl: string;
};

export type MenuOption = {
  id: string;
  label: string;
  price: number;
};

export type Menu = {
  id: string;
  name: string;
  images: MenuImage[];
  menuOptions: MenuOption[];
};

export type ShopCardProps = {
  shop?: Shop;
  menusOption: MenuItem[];
  addMenuOptionToCart: (optionId: string, menusOption: MenuItem[]) => void;
};
const ShopCard = ({
  shop,
  menusOption,
  addMenuOptionToCart,
}: ShopCardProps) => {
  return (
    <div className="">
      <div className="">
        <h2 className="text-center text-3xl p-2 m-2">{shop?.name}</h2>
        <div className="bg-amber-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {menusOption.map(menu => (
            <div
              key={menu.id}
              className="bg-white  rounded-2xl shadow-md overflow-hidden touch-manipulation"
            >
              <div>
                {menu.images[0] && (
                  <Image
                    src={menu.images[0].imageUrl}
                    alt={menu.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="p-4 space-y-2">
                <h2 className="text-xl  font-semibold text-gray-800">
                  {menu.name}
                </h2>

                <div className="mt-2 space-y-1">
                  {menu.menuOptions.map(option => (
                    <button
                      onClick={() =>
                        addMenuOptionToCart(option.id, menusOption)
                      }
                      key={option.id}
                      className="w-full flex justify-between items-center bg-green-50 hover:bg-green-200 active:bg-green-300 rounded-xl px-4 py-4 text-xl font-medium text-gray-800 shadow-md transition-all duration-150"
                    >
                      <span>{option.label}</span>
                      <span className="text-green-700">{option.price} บาท</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ShopCard;
