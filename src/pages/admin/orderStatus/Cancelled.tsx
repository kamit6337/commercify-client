import AllOrderStatus from "@/components/admin/order-status/AllOrderStatus";

const Cancelled = () => {
  return <AllOrderStatus querykey="all cancelled" path="cancelled" />;
};

export default Cancelled;
