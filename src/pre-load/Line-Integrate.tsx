"use client";
import { Button } from "@/components/ui/button";
import liff from "@line/liff";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LineUser } from "../../types/lineUser";
import { api } from "@/app/api/lineUsers.api";

const Page = () => {
  const [user, setUser] = useState<LineUser | null>(null);
  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: "2007542481-DdLb0oJ3" });

        if (!liff.isLoggedIn()) {
          liff.login();
          return false;
        }
        const user = await liff.getProfile();

        const userData: LineUser = {
          userId: user.userId,
          displayName: user.displayName,
          pictureUrl: user.pictureUrl ?? "",
        };

        setUser(userData);

        // api store user to db and  jwt
        await api.getLineUserById(user.userId);
        // keep user state global
        // await fetchProfile(user.userId);
      } catch (error) {
        console.error("LIFF init error", error);
      }
    };
    initLiff();
  }, []);

  const handleLogout = () => {
    liff.logout();
  };
  return (
    <div className="bg-blue-300 min-h-screen flex flex-col items-center justify-center p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Hello, {user?.displayName}</h1>
      <p>uuid : {user?.userId}</p>
      {user?.pictureUrl && (
        <Image
          src={user.pictureUrl}
          width={100}
          height={100}
          alt="user Picture"
          className="rounded-full shadow-lg"
        />
      )}

      <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Page;

// ref https://developers.line.biz/en/reference/messaging-api

// .....................
// client add channel
// user subscription channel
// frontend get data from Line  send data to backend to store user done !
// upload image r3
// shop create menu
// scan qr code to shop
