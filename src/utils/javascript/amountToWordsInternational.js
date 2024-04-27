function amountToWordsInternational(amount) {
  // Array of units up to trillion
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
  // Array of scales
  const scales = ["", "Thousand", "Million", "Billion", "Trillion"];

  // Function to convert two digits to words
  function convertTwoDigits(num) {
    if (num === 0) {
      return "";
    } else if (num < 10) {
      return units[num] + " ";
    } else if (num < 20) {
      return (
        [
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
        ][num - 10] + " "
      );
    } else {
      return tens[Math.floor(num / 10)] + " " + units[num % 10] + " ";
    }
  }

  // Function to convert three digits to words
  function convertThreeDigits(num) {
    let str = "";
    if (num >= 100) {
      str += units[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }
    str += convertTwoDigits(num);
    return str;
  }

  // Function to convert given number to words
  function convertToWords(num) {
    if (num === 0) return "Zero";
    let words = "";
    let scaleIndex = 0;
    while (num > 0) {
      if (num % 1000 !== 0) {
        words =
          convertThreeDigits(num % 1000) + scales[scaleIndex] + " " + words;
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }
    return words.trim();
  }

  return convertToWords(amount);
}

export default amountToWordsInternational;

// Test the function
console.log(amountToWordsInternational(162083)); // Output: "One Hundred Sixty Two Thousand Eighty Three"
