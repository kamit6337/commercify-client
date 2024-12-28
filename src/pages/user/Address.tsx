import { Helmet } from "react-helmet";
import { useState } from "react";
import NewAddressForm from "../../components/NewAddressForm";
import { useOutletContext } from "react-router-dom";
import { ADDRESS } from "@/types";
import Icons from "@/assets/icons";
import SingleAddress from "./SingleAddress";

type OUTLET = {
  addresses: ADDRESS[];
};

const Address = () => {
  const { addresses: userAddress } = useOutletContext<OUTLET>();
  const [openNewAddressForm, setOpenNewAddressForm] = useState(false);

  const handleCancel = () => {
    setOpenNewAddressForm(false);
  };

  return (
    <>
      <Helmet>
        <title>Manage Addresses</title>
      </Helmet>
      <section className="p-5 flex flex-col gap-10 bg-white">
        <p className="text-lg">Manage Addresses</p>

        {openNewAddressForm ? (
          <NewAddressForm handleCancel={handleCancel} />
        ) : (
          <div
            className="p-4 border flex items-center gap-4 text-blue-700 cursor-pointer"
            onClick={() => setOpenNewAddressForm(true)}
          >
            <p>
              <Icons.plus />
            </p>
            <p className="uppercase text-sm">Add New Address</p>
          </div>
        )}

        {/* MARK: USER ADDRESSES */}
        <div className="border-2">
          {userAddress.length > 0 ? (
            userAddress.map((address) => {
              return (
                <SingleAddress key={address._id} singleAddress={address} />
              );
            })
          ) : (
            <div className="w-full h-60 flex justify-center items-center">
              <p>No Address available</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Address;
