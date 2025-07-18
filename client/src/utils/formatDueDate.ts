import { format, parseISO, isToday, isTomorrow, isYesterday } from "date-fns";

export const formatTaskDueDate = (isoString: string): string => {
  const date = parseISO(isoString);
  if (isNaN(date?.getTime())) return "Invalid date";
  const time = format(date, "h:mm a");

  if (isToday(date)) {
    return `today at ${time}`;
  }

  if (isTomorrow(date)) {
    return `tomorrow at ${time}`;
  }

  if (isYesterday(date)) {
    return `yesterday at ${time}`;
  }

  return `${format(date, "MMM d yyyy")} at ${time}`;
};
