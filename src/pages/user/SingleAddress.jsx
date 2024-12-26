import { useState } from "react";
import UpdateAddressForm from "../../components/UpdateAddressForm";
import { Icons } from "../../assets/icons";
import Loading from "../../containers/Loading";
import useUserAddressDelete from "../../hooks/mutation/address/useUserAddressDelete";

const SingleAddress = ({ singleAddress }) => {
  const [isUpdateAddress, setIsUpdateAddress] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);

  const { _id, name, mobile, country, district, state, address } =
    singleAddress;

  const { mutate, isPending } = useUserAddressDelete(_id);

  const handleCancel = () => {
    setShowOption(false);
    setShowDeleteOption(false);
  };

  if (isUpdateAddress) {
    return (
      <UpdateAddressForm
        data={singleAddress}
        handleCancel={() => setIsUpdateAddress(false)}
      />
    );
  }

  return (
    <div className="p-5 border-b-2 last:border-none flex justify-between items-start">
      <div>
        <div className="flex items-center gap-10">
          <p className="capitalize font-semibold tracking-wide">{name}</p>
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
        <button className="" onClick={() => setShowOption((prev) => !prev)}>
          {showOption ? (
            <Icons.cancel className="text-xl" />
          ) : (
            <Icons.options />
          )}
        </button>

        {showOption && (
          <div className="absolute z-20 top-full w-32 right-0 shadow-2xl border ">
            <p
              className="py-3 text-sm border-b cursor-pointer text-center"
              onClick={() => {
                setIsUpdateAddress(true);
                handleCancel();
              }}
            >
              Edit
            </p>
            <p
              className="py-3 text-sm cursor-pointer text-center"
              onClick={() => setShowDeleteOption(true)}
            >
              Delete
            </p>
          </div>
        )}
        {showDeleteOption && showOption && (
          <div className="absolute bg-white z-30 top-full px-4 right-0 shadow-2xl border whitespace-nowrap py-4 space-y-2 text-sm">
            <p>Are you sure to delete this Address</p>
            <div className="flex justify-between items-center gap-2">
              <p
                className="flex-1 text-center border rounded p-2 cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </p>
              <button
                disabled={isPending}
                className="flex-1 text-center border rounded p-2 cursor-pointer"
                onClick={mutate}
              >
                {isPending ? <Loading small={true} /> : "Done"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleAddress;
