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
  return dayjs(date).utc().format(format);
};

export const getCurrentDate = (format = "YYYY-MM-DD HH:mm:ss"): string => {
  return dayjs().utc().format(format);
};

export const addDays = (date: Date | string, days: number): Date => {
  return dayjs(date).utc().add(days, "day").toDate();
};

export const subtractDays = (date: Date | string, days: number): Date => {
  return dayjs(date).utc().subtract(days, "day").toDate();
};

export const isBefore = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  return dayjs(date1).utc().isBefore(dayjs(date2).utc());
};

export const isAfter = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  return dayjs(date1).utc().isAfter(dayjs(date2).utc());
};

export const getRelativeTime = (date: Date | string): string => {
  return dayjs(date).utc().fromNow();
};

export const getDuration = (
  start: Date | string,
  end: Date | string
): number => {
  return dayjs(end).utc().diff(dayjs(start).utc(), "millisecond");
};

export const formatDuration = (milliseconds: number): string => {
  return dayjs.duration(milliseconds).humanize();
};
