/**
 * @param a
 */
import { formatRelative } from 'date-fns';

export const uuid = (a = ''): string =>
  a
    ? /* eslint-disable no-bitwise */
      ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
    : `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, uuid);

export const realTimeVn = (time: Date) => {
  return new Date(time.getTime() + 7 * 60 * 60 * 1000);
};

export const formatDate = (date: Date) => {
  let formatedDate = '';
  if (date) {
    const messageDate = realTimeVn(date);
    const nowDate = realTimeVn(new Date());
    formatedDate = formatRelative(messageDate, nowDate);
    formatedDate = formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
  }
  return formatedDate;
};
