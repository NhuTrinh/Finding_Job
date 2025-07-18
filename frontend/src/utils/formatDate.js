export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid date';

  const day = String(date.getDate()).padStart(2, '0');       // lấy ngày (01-31)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // lấy tháng (0-11 nên cần +1)
  const year = date.getFullYear();                           // lấy năm

  return `${day}/${month}/${year}`;
};