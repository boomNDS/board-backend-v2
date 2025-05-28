import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const formatDate = (
  date: Date | string,
  format = "YYYY-MM-DD HH:mm:ss"
): string => {
  return dayjs(date).format(format);
};

export const getCurrentDate = (format = "YYYY-MM-DD HH:mm:ss"): string => {
  return dayjs().format(format);
};

export const addDays = (date: Date | string, days: number): Date => {
  return dayjs(date).add(days, "day").toDate();
};

export const subtractDays = (date: Date | string, days: number): Date => {
  return dayjs(date).subtract(days, "day").toDate();
};

export const isBefore = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  return dayjs(date1).isBefore(dayjs(date2));
};

export const isAfter = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  return dayjs(date1).isAfter(dayjs(date2));
};

export const getRelativeTime = (date: Date | string): string => {
  return dayjs(date).fromNow();
};

export const getDuration = (
  start: Date | string,
  end: Date | string
): number => {
  return dayjs(end).diff(dayjs(start), "millisecond");
};

export const formatDuration = (milliseconds: number): string => {
  return dayjs.duration(milliseconds).humanize();
};
