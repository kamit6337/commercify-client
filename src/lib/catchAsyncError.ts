/* eslint-disable @typescript-eslint/no-explicit-any */
// Define the type for an asynchronous function
type AsyncFunction<T extends unknown[], R> = (...args: T) => Promise<R>;

const catchAsyncError = <T extends unknown[], R>(func: AsyncFunction<T, R>) => {
  return async (...args: T): Promise<R> => {
    try {
      return await func(...args);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error?.request) {
        throw new Error("Server is Down. Please try later");
      }
      throw error;
    }
  };
};

export default catchAsyncError;
