import { Helmet } from "react-helmet";
import { Icons } from "../../assets/icons";
import { useState } from "react";
import NewAddressForm from "../../components/NewAddressForm";
import UpdateAddressForm from "../../components/UpdateAddressForm";
import { useSelector } from "react-redux";
import { addressState } from "../../redux/slice/addressSlice";

const Address = () => {
  const { addresses: userAddress } = useSelector(addressState);
  const [openNewAddressForm, setOpenNewAddressForm] = useState(false);
  const [showAddressOptionIndex, setShowAddressOptionIndex] = useState(null);
  const [updateAddressIndex, setUpdateAddressIndex] = useState(null);

  const handleCancel = () => {
    setOpenNewAddressForm(false);
  };

  const handleCancelUpdateForm = () => {
    setUpdateAddressIndex(null);
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
            userAddress.map((obj, i) => {
              const { name, mobile, country, district, state, address } = obj;

              if (updateAddressIndex === i) {
                return (
                  <UpdateAddressForm
                    key={i}
                    data={obj}
                    handleCancel={handleCancelUpdateForm}
                  />
                );
              }

              return (
                <div
                  key={i}
                  className="p-5 border-b-2 last:border-none flex justify-between items-start"
                >
                  <div>
                    <div className="flex items-center gap-10">
                      <p className="capitalize font-semibold tracking-wide">
                        {name}
                      </p>
                      <p className="font-semibold tracking-wide">{mobile}</p>
                    </div>
                    <p className="mt-6 mb-2 text-sm">{address}</p>
                    <div className="flex">
                      <p className="text-sm">{district},</p>
                      <p className="ml-2 text-sm">{state}</p>
                      <p className="mx-1">-</p>
                      <p>{country}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className=""
                      onClick={() =>
                        showAddressOptionIndex === i
                          ? setShowAddressOptionIndex(null)
                          : setShowAddressOptionIndex(i)
                      }
                    >
                      {showAddressOptionIndex === i ? (
                        <Icons.cancel className="text-xl" />
                      ) : (
                        <Icons.options />
                      )}
                    </button>

                    {showAddressOptionIndex === i && (
                      <div className="absolute z-20 top-full w-32 right-0 shadow-2xl border ">
                        <p
                          className="py-3 text-sm border-b cursor-pointer text-center"
                          onClick={() => {
                            setUpdateAddressIndex(i);
                            setShowAddressOptionIndex(null);
                          }}
                        >
                          Edit
                        </p>
                        <p className="py-3 text-sm cursor-pointer text-center">
                          Delete
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
