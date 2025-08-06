shop can change

getOrderPurchase: (orderId: string) =>
axiosInstance.get(`orders/purchase/${orderId}`),
updateOrderPurchase: (orderId: string) =>
axiosInstance.patch(`/orders/${orderId}`),

    each menuOption change status to done

....
move some logic to hooks
