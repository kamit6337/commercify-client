function rupeesToWords(amount: number) {
  // Array of units up to crore
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  // Array of tens
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  // Function to convert two digits to words
  function convertTwoDigits(num: number) {
    if (num === 0) {
      return "";
    } else if (num < 20) {
      return units[num] + " ";
    } else {
      return tens[Math.floor(num / 10)] + " " + units[num % 10] + " ";
    }
  }

  // Function to convert three digits to words
  function convertThreeDigits(num: number) {
    let str = "";
    if (num >= 100) {
      str += units[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }
    str += convertTwoDigits(num);
    return str;
  }

  // Function to convert given number to words
  function convertToWords(num: number) {
    if (num === 0) return "Zero Rupees";
    let words = "";
    if (num >= 10000000) {
      words += convertThreeDigits(Math.floor(num / 10000000)) + "Crore ";
      num %= 10000000;
    }
    if (num >= 100000) {
      words += convertThreeDigits(Math.floor(num / 100000)) + "Lakh ";
      num %= 100000;
    }
    if (num >= 1000) {
      words += convertThreeDigits(Math.floor(num / 1000)) + "Thousand ";
      num %= 1000;
    }
    if (num > 0) {
      words += convertThreeDigits(num);
    }
    return words.trim();
  }

  return convertToWords(amount);
}

export default rupeesToWords;
