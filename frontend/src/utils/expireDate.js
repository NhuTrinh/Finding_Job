export const getExpirationDateTwoMonthsLater = (createdDate) => {
  const date = new Date(createdDate);
  date.setMonth(date.getMonth() + 2);
  return date.toLocaleDateString();
};