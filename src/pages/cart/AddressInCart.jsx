import { useState } from "react";
import useLoginCheck from "../../hooks/auth/useLoginCheck";
import { Link } from "react-router-dom";
import { Icons } from "../../assets/icons";
import NewAddressForm from "../../components/NewAddressForm";
import { useDispatch, useSelector } from "react-redux";
import {
  addressState,
  updateSelectedAddress,
} from "../../redux/slice/addressSlice";

const AddressInCart = () => {
  const dispatch = useDispatch();
  const { data: user } = useLoginCheck();
  const { addresses: userAddress, selectedAddress } = useSelector(addressState);

  const [openNewAddressForm, setOpenNewAddressForm] = useState(false);

  const handleCancel = () => {
    setOpenNewAddressForm(false);
  };

  return (
    <section className="flex flex-col gap-5">
      {/* MARK: LOGIN PART */}
      <div className="bg-white w-full py-4 px-10 flex flex-col gap-2">
        <p className="uppercase font-semibold tracking-wide">Login </p>
        <div className="flex items-center gap-1 text-sm">
          <p>{user.name}</p>
          <p>-</p>
          <p>{user.email}</p>
        </div>
      </div>

      {/* MARK: ADDRESS PART */}
      <div className="bg-white ">
        <p className="uppercase font-semibold tracking-wide bg-blue-500 text-white py-4 px-10">
          Delivery Address
        </p>
        <div className="flex flex-col ">
          {userAddress.length > 0 ? (
            userAddress.map((obj, i) => {
              const { _id, name, mobile, pinCode, district, state, address } =
                obj;

              return (
                <div
                  className="flex items-start gap-4 border-b px-5 py-10 "
                  key={i}
                >
                  <input
                    type="radio"
                    id={_id}
                    className="mx-1 my-[6px]"
                    checked={selectedAddress._id === _id}
                    onChange={() => dispatch(updateSelectedAddress(obj))}
                  />
                  <label htmlFor={_id}>
                    <div className="cursor-pointer">
                      <div className="flex items-center gap-10">
                        <p className="capitalize font-semibold tracking-wide">
                          {name}
                        </p>
                        <p className="font-semibold tracking-wide">{mobile}</p>
                      </div>
                      <p className="mt-4 mb-2 text-sm">{address}</p>
                      <div className="flex">
                        <p className="text-sm">{district},</p>
                        <p className="ml-2 text-sm">{state}</p>
                        <p className="mx-1">-</p>
                        <p>{pinCode}</p>
                      </div>
                      {selectedAddress._id === _id && (
                        <button className="mt-5 px-16 py-4 bg-orange-500 rounded-md w-max text-white font-semibold tracking-wide uppercase">
                          <Link to={`/cart/checkout`}>Deliver Here</Link>
                        </button>
                      )}
                    </div>
                  </label>
                </div>
              );
            })
          ) : (
            <div className="w-full h-60 flex flex-col gap-2 justify-center items-center">
              <p className="text-xl">No Address Available</p>
              <p className="text-sm">
                Click on <span className="italic">Add New Address</span> to
                create new address
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MARK: ADD NEW ADDRESS */}
      {openNewAddressForm ? (
        <NewAddressForm handleCancel={handleCancel} />
      ) : (
        <div
          className="bg-white w-full p-5 flex items-center gap-2 text-blue-500 cursor-pointer"
          onClick={() => setOpenNewAddressForm(true)}
        >
          <p>
            <Icons.plus />
          </p>
          <p className="uppercase text-sm ">add new address</p>
        </div>
      )}
    </section>
  );
};

export default AddressInCart;
