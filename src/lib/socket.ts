import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  query: { shopId: "" },
});

socket.on("newOrder", (order) => {
  console.log("🆕 New Order:", order);
});

socket.on("orderUpdated", (order) => {
  console.log("🔄 Order Updated:", order);
});
