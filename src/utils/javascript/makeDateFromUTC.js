import addZeroToDigit from "./addZeroToDigit";

const monthsList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const makeDateFromUTC = (UTC) => {
  const finalDate = new Date(UTC);

  const date = finalDate.getDate();
  const month = finalDate.getMonth();
  const year = finalDate.getFullYear();

  return `${addZeroToDigit(date)} ${monthsList[month]} ${year}`;
};

export default makeDateFromUTC;
