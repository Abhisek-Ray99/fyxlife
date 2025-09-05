import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (date: number | Date, format = 'MMM D, YYYY') => {
  return dayjs(date).format(format);
};

export const timeAgo = (date: number | Date) => {
  return dayjs(date).fromNow();
};