const modifyEmail = (email: string): string => {
  const splitEmail = email.split("@");
  const emailProvider = splitEmail.at(-1);
  const slice = splitEmail.slice(0, -1);
  const joined = slice.join("@");
  const firstThree = joined.slice(0, 3);
  return `${firstThree}***@${emailProvider}`;
};

export default modifyEmail;
