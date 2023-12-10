export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60000;
export const ONE_HOUR = 3600000;
export const ONE_DAY = 86400000;
export const TWO_DAY = 172800000;

function padLeft(number: number, count: number, text: string = "0"): string {
  return text.repeat(count - number.toString().length) + number;
}

function toDate(date: Date | number) {
  return typeof date == "number" ? new Date(date) : date;
}

export function dateToAgo(
  date: Date | number,
  withHour: boolean = false
): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dd = toDate(date);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = now.getTime() - d.getTime();

  if (withHour && diff < 6 * ONE_HOUR) {
    return `${padLeft(dd.getHours(), 2)}:${padLeft(dd.getMinutes(), 2)}`;
  } else if (diff < ONE_DAY) {
    return "Today";
  } else if (diff < TWO_DAY) {
    return "Yesterday";
  }

  return `${padLeft(dd.getDate(), 2)}/${padLeft(
    dd.getMonth() + 1,
    2
  )}/${dd.getFullYear()}`;
}

export function formatTime(date: Date | number): string {
  const d = toDate(date);
  return `${padLeft(d.getHours(), 2)}:${padLeft(d.getMinutes(), 2)}`;
}

export function isSameDay(date1: Date | number, date2: Date | number) {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  return d1.getDate() == d2.getDate();
}

export function lastSeen(time: number): string {
  let diff = Date.now() - time;
  let str = "last seen ";

  if (diff > ONE_DAY) {
    let t = Math.floor(diff / ONE_DAY);
    str += `at ${t} day${t > 1 ? "s" : ""} ago`;
  } else if (diff > ONE_HOUR) {
    let t = Math.floor(diff / ONE_HOUR);
    str += `at ${t} hour${t > 1 ? "s" : ""} ago`;
  } else if (diff > ONE_MINUTE) {
    let t = Math.floor(diff / ONE_MINUTE);
    str += `at ${t} minute${t > 1 ? "s" : ""} ago`;
  } else {
    str += "just now";
  }

  return str;
}
