import { Outlet } from "react-router-dom";
import PriceList from "../components/PriceList";

const CartLayout = () => {
  return (
    <section className="p-5 bg-gray-100">
      <main className="flex gap-5">
        <div className="bg-white flex-1">
          <Outlet />
        </div>
        <div className="bg-white w-96 h-96 sticky top-[100px]">
          <PriceList />
        </div>
      </main>
    </section>
  );
};

export default CartLayout;
