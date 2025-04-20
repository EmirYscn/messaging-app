// export function formatPostDate(date: Date | string): string {
//   const formattedDate = formatDistance(new Date(), date);

//   return formattedDate + " ago";
// }

// export function formatDate(date: Date | string): string {
//   const formattedDate = format(date, "PP");

//   return formattedDate;
// }

export function formatDateToHour(date: Date | string): string {
  const formattedDate = new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return formattedDate;
}
