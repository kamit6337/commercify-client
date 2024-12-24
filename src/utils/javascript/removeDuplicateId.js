const removeDuplicateId = (arrayOfObjects) => {
  // Object to store unique IDs
  const uniqueIds = {};

  // Filter out duplicates based on ID
  const uniqueArrayOfObjects = arrayOfObjects.filter((obj) => {
    if (!uniqueIds[obj._id]) {
      uniqueIds[obj._id] = true; // Mark the ID as encountered
      return true; // Include the current object in the filtered array
    }
    return false; // Exclude the current object (it's a duplicate)
  });

  return uniqueArrayOfObjects;
};

export default removeDuplicateId;
