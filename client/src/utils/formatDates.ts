import { format, parseISO, isToday, isYesterday } from "date-fns";

export const formatDates = (isoString: string): string => {
  const date = parseISO(isoString);
  if (isNaN(date?.getTime())) return "Invalid date";
  const time = format(date, "h:mm a");

  if (isToday(date)) {
    return `today at ${time}`;
  }

  if (isYesterday(date)) {
    return `yesterday at ${time}`;
  }

  return `${format(date, "MMM d")} at ${time}`;
};
