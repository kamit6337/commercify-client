const checkInputIsNumber = (inputStr, digit = 10) => {
  // Regular expression pattern to match exactly 10 digits
  const regex = new RegExp(`^\\d{${digit}}$`);
  // Test if the input string matches the pattern
  return regex.test(inputStr);
};

export default checkInputIsNumber;
