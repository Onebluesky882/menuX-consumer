"use client";

import { LucideCheckCircle, LucideStore } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { shopApi } from "../api/shop.api";

type Shop = {
  id: string;
  name: string;
  active: boolean;
};

const Homepage = () => {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const getShops = async () => {
      try {
        const res = await shopApi.getAllShop();
        setShops(res.data.data);
      } catch (error) {
        console.error("❌ Failed to load shops:", error);
      }
    };
    getShops();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="text-center py-10 bg-white shadow">
        <h1 className="text-3xl font-bold text-gray-800">
          🍽️ ระบบสั่งอาหาร (MVP)
        </h1>
        <p className="text-gray-600 mt-2">
          🎯 เป้าหมาย: ทำให้ระบบทำงานได้ครบวงจร
        </p>
      </section>

      {/* Shop List */}
      <section className="max-w-5xl mx-auto px-4 mt-14">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          🛒 ร้านค้าที่เปิดให้บริการ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map(shop => (
            <ShopCard
              key={shop.id}
              id={shop.id}
              name={shop.name}
              active={shop.active}
              onClick={() => router.push(`/menus/${shop.id}`)}
            />
          ))}
        </div>
      </section>
      {/* Flow */}
      <section className="max-w-3xl mx-auto mt-10 px-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📦 ขั้นตอนการทำงาน
        </h2>
        <pre className="space-y-4">
          {[
            "1. ลูกค้าเลือกอาหาร → กดสั่ง",
            "2. หน้าชำระเงิน → ลูกค้าจ่ายเงิน",
            "3. API ตรวจสอบยอด → ยืนยันการชำระ",
            "4. ส่งออเดอร์ไปครัว → ครัวรับออเดอร์",
            "5. ครัวอัพเดทสถานะ → Line แจ้งลูกค้า",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <LucideCheckCircle className="text-green-500 mt-1 w-5 h-5" />
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </pre>
      </section>
    </main>
  );
};

type ShopCardProps = {
  id: string;
  name: string;
  active: boolean;
  onClick: () => void;
};

const ShopCard = ({ name, active, onClick }: ShopCardProps) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{name}</h3>
        <LucideStore className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex items-center justify-between">
        {active ? (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            เปิดให้บริการ
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-500">
            ปิดให้บริการ
          </span>
        )}
        <button
          onClick={e => {
            e.stopPropagation(); // ป้องกัน event bubble
            onClick();
          }}
          className="text-blue-600 hover:underline text-sm font-medium"
          aria-label={`ดูเมนูร้าน ${name}`}
        >
          ดูเมนู
        </button>
      </div>
    </div>
  );
};

export default Homepage;
