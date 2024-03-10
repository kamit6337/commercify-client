const catchAsyncError = (func) => {
  return async (...args) => {
    try {
      return await func(...args);
    } catch (error) {
      // Check if the error has a response
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Error response status:", error.response.status);
        console.log("Error response data:", error.response.data);

        // Extract the error message from the response data
        const errorMessage =
          error.response.data.message || "An error occurred.";
        throw new Error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("No response received:", error.request);
        throw new Error("No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error setting up the request:", error.message);
        throw new Error("Error setting up the request.");
      }
    }
  };
};

export default catchAsyncError;
