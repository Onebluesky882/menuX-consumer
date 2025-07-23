"use client";
import { useEffect, useState } from "react";
import { shopApi } from "../api/shop.api";
import { useRouter } from "next/navigation";

export type ShopsConsumer = {
  id: string;
  name: string;
  active: boolean;
  onClick: (path: string) => void;
};

const Homepage = () => {
  const router = useRouter();
  const [shops, setShops] = useState<ShopsConsumer[]>([]);

  useEffect(() => {
    const getShops = async () => {
      const res = await shopApi.getAllShop();
      setShops(res.data.data);
    };
    getShops();
  }, []);

  return (
    <>
      <main className="   shadow-sm rounded-sm ">
        <div className="sm:w-120 md:w-220">
          <div className="outline-1">
            <h1 className="">section one</h1>
            <code>
              MVP Flow Design - ระบบสั่งอาหาร 🎯 เป้าหมาย:
              ทำให้ระบบทำงานได้ครบวงจร
            </code>

            <ul>
              <li>1. ลูกค้าเลือกอาหาร → กดสั่ง</li>
              <li>2. หน้าชำระเงิน → ลูกค้าจ่ายเงิน</li>
              <li> 3. API ตรวจสอบยอด → ยืนยันการชำระ </li>
              <li>4. ส่งออเดอร์ไปครัว → ครัวรับออเดอร์</li>
              <li>5. ครัวอัพเดทสถานะ → Line แจ้งลูกค้า</li>
            </ul>
          </div>

          <div className="outline-1 my-5">
            section 2 // api get all shop
            <div>
              {shops.map((s) => (
                <ShopCard
                  key={s.id}
                  id={s.id}
                  name={s.name}
                  active={s.active}
                  onClick={(path) => router.push(path)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

type ShopCardProps = ShopsConsumer & {
  onClick: (path: string) => void;
};

const ShopCard = ({ id, name, active, onClick }: ShopCardProps) => {
  return (
    <div
      key={id}
      onClick={() => onClick(`menus/${id}`)}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
        {name}
      </h3>

      <div className="flex items-center justify-between">
        {active ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            เปิดให้บริการ
          </span>
        ) : (
          <span>close</span>
        )}

        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          ดูรายละเอียด
        </button>
      </div>
    </div>
  );
};

export default Homepage;
