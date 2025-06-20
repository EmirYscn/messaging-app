export function formatDateToHour(date: Date | string): string {
  const formattedDate = new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formattedDate;
}
