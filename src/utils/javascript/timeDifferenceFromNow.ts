function timeDifferenceFromNow(isoString: string | Date | undefined): string {
  if (!isoString) return "";

  const now = new Date().getTime();
  const targetDate = new Date(isoString).getTime();

  // Calculate the difference in milliseconds
  const diffInMs = targetDate - now;

  // If the time is in the past
  if (diffInMs <= 0) {
    return "Time has already passed!";
  }

  // Convert the difference to different units
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Days
  const hours = Math.floor(
    (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  ); // Hours
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60)); // Minutes
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000); // Seconds

  return `${days} days ${hours} hrs ${minutes} min ${seconds} sec`;
}

export default timeDifferenceFromNow;
