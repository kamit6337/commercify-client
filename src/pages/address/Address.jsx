import { Helmet } from "react-helmet";
import { Icons } from "../../assets/icons";
import useUserAddress from "../../hooks/query/useUserAddress";
import Loading from "../../containers/Loading";
import { useState } from "react";
import NewAddressForm from "../../components/NewAddressForm";

const Address = () => {
  const { isLoading, error, data } = useUserAddress();
  const [openNewAddressForm, setOpenNewAddressForm] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div>
        <p>{error.message}</p>
      </div>
    );
  }

  const handleCancel = () => {
    setOpenNewAddressForm(false);
  };

  return (
    <>
      <Helmet>
        <title>Manage Addresses</title>
      </Helmet>
      <section className="p-5 flex flex-col gap-10">
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
          {data.data.length > 0 ? (
            data.data.map((obj, i) => {
              const { name, mobile, pinCode, district, state, address } = obj;

              return (
                <div key={i} className="p-5 border-b-2 last:border-none">
                  <div className="flex items-center gap-10">
                    <p className="capitalize">{name}</p>
                    <p>{mobile}</p>
                  </div>
                  <p className="mt-6 mb-2 text-sm">{address}</p>
                  <div className="flex">
                    <p className="text-sm">{district},</p>
                    <p className="ml-2 text-sm">{state}</p>
                    <p className="mx-1">-</p>
                    <p>{pinCode}</p>
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
