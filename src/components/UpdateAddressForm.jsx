/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import Toastify from "../lib/Toastify";
import { useForm } from "react-hook-form";
import { patchReq } from "../utils/api/api";
import checkInputIsNumber from "../utils/javascript/checkInputIsNumber";
import Loading from "../containers/Loading";
import statesDistrictsPinCode from "../data/statesDistrictsPinCode";
import { useDispatch } from "react-redux";
import { updateAddressData } from "../redux/slice/addressSlice";

const UpdateAddressForm = ({ handleCancel, data }) => {
  const dispatch = useDispatch();
  const { _id, name, mobile, pinCode, district, state, address } = data;

  const [selectedState, setSelectedState] = useState(state);
  const [selectedDistrict, setSelectedDistrict] = useState(district);
  const [selectedPinCode, setSelectedPinCode] = useState(pinCode);
  const { ToastContainer, showErrorMessage, showSuccessMessage } = Toastify();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: name,
      mobile: mobile,
      address: address,
    },
  });

  const allStates = useMemo(() => {
    const states = Object.keys(statesDistrictsPinCode);
    return states;
  }, []);

  const districtsOfState = useMemo(() => {
    if (!selectedState) return [];

    const stateDistricts = statesDistrictsPinCode[selectedState];
    const districts = Object.keys(stateDistricts);
    return districts;
  }, [selectedState]);

  const districtPinCodes = useMemo(() => {
    if (!selectedState || !selectedDistrict) return [];

    const selectState = statesDistrictsPinCode[selectedState];
    const selectDistrict = selectState[selectedDistrict];

    const pinCodes = Object.values(selectDistrict);
    const convertStringToNumber = [
      ...new Set(pinCodes.map((str) => Number(str))),
    ];
    convertStringToNumber.sort((a, b) => a - b);
    return convertStringToNumber;
  }, [selectedDistrict, selectedState]);

  const onSubmit = async (data) => {
    if (!selectedState || !selectedDistrict || !selectedPinCode) {
      showErrorMessage({ message: "Fill all the field" });
      return;
    }

    if (
      data.name === name &&
      data.mobile === mobile &&
      data.address === address &&
      selectedState === state &&
      selectedDistrict === district &&
      selectedPinCode === pinCode
    ) {
      showErrorMessage({
        message: "No Update on Address. Please update to Submit.",
      });
      return;
    }

    try {
      const postData = { ...data };
      postData.state = selectedState;
      postData.district = selectedDistrict;
      postData.pinCode = selectedPinCode;
      postData.id = _id;

      const updatedAddress = await patchReq("/address", postData);
      handleCancel();
      console.log("updatedAddress", updatedAddress);
      dispatch(updateAddressData(updatedAddress));
      showSuccessMessage({
        message: updatedAddress.message || "Address updated",
      });
    } catch (error) {
      console.log("error", error);
      showErrorMessage({
        message: error.message || "Issue in Add New Address. Try Later...",
      });
    }
  };

  return (
    <>
      <div className="bg-sky-50 ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-[700px] p-5 flex flex-col gap-10"
        >
          <p className="uppercase text-blue-600">add new address</p>
          <div className="grid grid-cols-2 gap-x-5">
            <div>
              <div className="border border-black">
                <input
                  {...register("name", {
                    required: true,
                  })}
                  spellCheck="false"
                  autoComplete="off"
                  placeholder="Name"
                  className="w-full bg-inherit p-4"
                />
              </div>
              <p className="h-4 mt-1 ml-1 text-xs text-red-500">
                {errors.name?.message}
              </p>
            </div>
            <div>
              <div className="border border-black">
                <input
                  {...register("mobile", {
                    required: true,
                    validate: (value) => {
                      if (!checkInputIsNumber(value)) {
                        return "Please input a valid mobile number";
                      }
                      return true;
                    },
                  })}
                  spellCheck="false"
                  autoComplete="off"
                  placeholder="Mobile"
                  className="w-full bg-inherit p-4"
                />
              </div>
              <p className="h-4 mt-1 ml-1 text-xs text-red-500">
                {errors.mobile?.message}
              </p>
            </div>
          </div>
          <div className="border border-black">
            <textarea
              {...register("address", {
                required: true,
              })}
              spellCheck="false"
              autoComplete="off"
              className="w-full bg-inherit p-4 overflow-y-hidden resize-none"
              placeholder="Address"
              rows="5"
            />
          </div>
          <div className="grid grid-cols-2 gap-x-5">
            <div className="border border-black">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-inherit p-4"
              >
                <option value={""} className="text-gray-300">
                  --select State--
                </option>
                {allStates.map((state, i) => {
                  return (
                    <option key={i} value={state}>
                      {state}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="border border-black">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-inherit p-4"
              >
                <option value={""} className="text-gray-300">
                  --select District--
                </option>
                {districtsOfState.map((district, i) => {
                  return (
                    <option key={i} value={district}>
                      {district}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="border border-black w-max">
            <select
              value={selectedPinCode}
              onChange={(e) => setSelectedPinCode(e.target.value)}
              className="w-full bg-inherit p-4"
            >
              <option value={""} className="text-gray-300">
                --select PinCode--
              </option>
              {districtPinCodes.map((pin, i) => {
                return (
                  <option key={i} value={pin}>
                    {pin}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex gap-10 items-center h-12">
            <button
              className="h-full px-20 bg-sky-200 flex items-center rounded-md text-blue-700 font-semibold tracking-wide "
              type="submit"
            >
              {isSubmitting ? <Loading /> : "Submit"}
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default UpdateAddressForm;
