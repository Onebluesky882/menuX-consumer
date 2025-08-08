"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const HelloWebsocket = () => {
  const [message, setMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to websocket server");
      socket.emit("hello", "hello from frontend");
    });

    socket.on("new-order", data => {
      console.log("📦 Got new order:", data);
      setMessage(data);
    });
    socket.on("server-response", data => {
      console.log("💬 Server says:", data);
      setMessage(data); // optional: update UI
    });

    socket.on("connect", () => {
      console.log(" connect to websocket server");

      socket.emit("hello", "hello from front");
    });
    socket.on("new-order", data => {
      console.log("got new order ", data);
      setMessage(data);
    });
    return () => {
      socket.disconnect();
      console.log("disconnect from websocket server");
    };
  }, [message]);

  return (
    <div>
      {" "}
      <p>websocket : {message}</p>
    </div>
  );
};

export default HelloWebsocket;
