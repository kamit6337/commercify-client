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

const shortMonthList = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const makeDateFromUTC = (UTC: Date) => {
  const finalDate = new Date(UTC);

  const date = finalDate.getDate();
  const month = finalDate.getMonth();
  const year = finalDate.getFullYear();

  return `${addZeroToDigit(date)} ${shortMonthList[month]} ${year}`;
};

export default makeDateFromUTC;
