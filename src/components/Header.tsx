import React from "react";
import { User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "./ToggleMode";

export const Header = () => {
  return (
    <header className="   sticky top-0 z-50 mt-2 ml-2 max-sm:m-2  max-sm:pt-2 ">
      <div className="px-2 py-2 flex items-center justify-between bg-white  shadow-sm rounded-sm  ">
        <div className="flex flex-co items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
            <Link href={"/"}>
              <span className="text-white font-bold text-lg">F</span>{" "}
            </Link>
          </div>

          <div>
            {" "}
            <h1 className="text-xl font-bold text-gray-800">MenuX</h1>
            <p className="text-xs text-gray-500">Delivering happiness</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="bg-black rounded-2xl">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
