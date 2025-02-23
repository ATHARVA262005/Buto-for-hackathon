export const getNextSundayMidnight = () => {
  // Get current date in IST
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 60 * 60000;
  const istTime = new Date(utc + istOffset);

  // Get this week's Sunday 11:59 PM
  const sunday = new Date(istTime);
  const daysUntilSunday = 7 - sunday.getDay();
  
  // If it's already Sunday, check if it's before or after 11:59 PM
  if (sunday.getDay() === 0) {
    if (sunday.getHours() >= 23 && sunday.getMinutes() >= 59) {
      // If after 11:59 PM, get next Sunday
      sunday.setDate(sunday.getDate() + 7);
    }
  } else {
    // Not Sunday, get upcoming Sunday
    sunday.setDate(sunday.getDate() + daysUntilSunday);
  }
  
  // Set time to 23:59
  sunday.setHours(23, 59, 0, 0);
  return sunday;
};

export const formatTimeLeft = (endDate) => {
  // Get current time in IST
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 60 * 60000;
  const istTime = new Date(utc + istOffset);
  
  const diff = endDate - istTime;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m IST`;
};
