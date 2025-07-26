import { format, isToday, isYesterday, parseISO } from "date-fns";

export const formatMessageTime = (dateInput: string | Date): string => {
  const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
  const time = format(date, "hh:mmaaa").replace(/am|pm/, (match) => " " + match.toUpperCase());

  if (isToday(date)) {
    return `today ${time}`;
  }

  if (isYesterday(date)) {
    return `yesterday ${time}`;
  }

  return `${format(date, "dd/MM/yyyy")} ${time}`;
};
