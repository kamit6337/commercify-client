import {
  ToastContainer as OriginalToastContainer,
  type ToastOptions,
  type ToastPosition,
  toast,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CustomToastOptions extends ToastOptions {
  message: string;
  time?: number;
  position?: ToastPosition;
}

interface ToastifyFunctions {
  showErrorMessage: (options: CustomToastOptions) => void;
  showSuccessMessage: (options: CustomToastOptions) => void;
  showAlertMessage: (options: CustomToastOptions) => void;
}

const Toastify = (): ToastifyFunctions => {
  const showErrorMessage = ({
    message,
    time = 5000,
    position = "top-right",
  }: CustomToastOptions) => {
    toast.error(message, {
      autoClose: time,
      position: position,
    });
  };

  const showSuccessMessage = ({
    message,
    time = 2000,
    position = "top-right",
  }: CustomToastOptions) => {
    toast.success(message, {
      position: position,
      autoClose: time,
    });
  };

  const showAlertMessage = ({
    message,
    time = 5000,
    position = "top-right",
  }: CustomToastOptions) => {
    toast.warn(message, {
      position: position,
      autoClose: time,
    });
  };

  return {
    showErrorMessage,
    showSuccessMessage,
    showAlertMessage,
  };
};

export const ToastContainer = OriginalToastContainer;
export default Toastify;
