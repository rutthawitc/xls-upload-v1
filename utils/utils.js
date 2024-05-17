export function convertToThaiBaht(number) {
  // Convert number to string and split into integer and decimal parts
  const [integerPart, decimalPart] = number.toFixed(2).toString().split('.');
  // Add commas for thousands separators
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );
  // Return formatted string with Thai Baht symbol
  return `${formattedIntegerPart}.${decimalPart}`;
}

export function excelSerialNumberToDate(serialNumber) {
  // Convert the serial number to milliseconds since January 1, 1970
  const milliseconds = (serialNumber - 25569) * 86400 * 1000;
  // Create a new Date object
  const date = new Date(milliseconds);
  // Get day, month, and year
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear() + 543;
  // Return the date in Thai date format (DD/MM/YYYY)
  return `${day}/${month}/${year}`;
}
