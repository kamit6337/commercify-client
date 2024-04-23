const catchAsyncError = (func) => {
  return async (...args) => {
    try {
      return await func(...args);
    } catch (error) {
      if (error.response) {
        console.log("Complete Error", error.response.data);
        const errorMessage =
          error.response.data.message || "An error occurred.";
        throw new Error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error("No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error("Error setting up the request.");
      }
    }
  };
};

export default catchAsyncError;
