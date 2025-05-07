import AllOrderStatus from "@/components/admin/order-status/AllOrderStatus";

const UnDelivered = () => {
  return <AllOrderStatus querykey="all undelivered" path="undelivered" />;
};

export default UnDelivered;
