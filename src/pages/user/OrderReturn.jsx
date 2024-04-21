import { useNavigate, useParams } from "react-router-dom";
import useUserOrders from "../../hooks/query/useUserOrders";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import Toastify from "../../lib/Toastify";

const OrderReturn = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, refetch } = useUserOrders();
  const { symbol, exchangeRate } = useSelector(currencyState);
  const { ToastContainer, showErrorMessage } = Toastify();

  const buyProduct = useMemo(() => {
    if (!id || !data) return null;

    const buy = data.data.find((obj) => obj._id === id);
    return { ...buy };
  }, [id, data]);

  if (!buyProduct) {
    return (
      <div>
        <p>Error occur</p>
      </div>
    );
  }

  return <div>OrderReturn</div>;
};

export default OrderReturn;
