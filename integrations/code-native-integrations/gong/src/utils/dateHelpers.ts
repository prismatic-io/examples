export const getDefaultDateRange = (days: number = 30) => {
  const now = new Date();
  const daysAgo = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  return {
    fromDate: daysAgo.toISOString(),
    toDate: now.toISOString()
  };
};

export const formatDateForGong = (date: Date): string => {
  return date.toISOString();
};