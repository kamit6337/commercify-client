const formatUTCDate = (utcDate: Date | undefined): string => {
  if (!utcDate) return "";

  const dateObj = new Date(utcDate);

  // Extract date components
  const day = dateObj.getUTCDate().toString().padStart(2, "0");
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  const year = dateObj.getUTCFullYear().toString();
  const hours = dateObj.getUTCHours().toString().padStart(2, "0");
  const minutes = dateObj.getUTCMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getUTCSeconds().toString().padStart(2, "0");

  // Construct the formatted date string
  const formattedDate = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;

  return formattedDate;
};

export default formatUTCDate;
