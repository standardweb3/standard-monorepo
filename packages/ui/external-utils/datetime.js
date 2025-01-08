import { differenceInDays, format, toDate } from "date-fns";

export function interpolateTimestamps(end, n) {
  const end_date = new Date(end).getTime();
  const start_date = end_date - 7 * 24 * 60 * 60 * 1000; // 7 days ago
  const interval = (end_date - start_date) / n - 1;
  // leave space for current_price
  const timestamps = Array.from(
    { length: n },
    (_, i) => start_date + i * interval
  );
  return timestamps;
}

export function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return (
      `${Math.floor(interval)} ${Math.floor(interval) === 1 ? "year" : "years"} ago`
    );
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return (
      `${Math.floor(interval)} ${Math.floor(interval) === 1 ? "month" : "months"} ago`
    );
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return (
      `${Math.floor(interval)} ${Math.floor(interval) === 1 ? "day" : "days"} ago`
    );
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return (
      `${Math.floor(interval)} ${Math.floor(interval) === 1 ? "hour" : "hours"} ago`
    );
  }
  interval = seconds / 60;
  if (interval > 1) {
    return (
      `${Math.floor(interval)} ${Math.floor(interval) === 1 ? "minute" : "minutes"} ago`
    );
  }
  if (Math.floor(seconds) <= 0) {
    return "recently";
  }
  return (
    `${Math.floor(seconds)} ${Math.floor(interval) === 1 ? "second" : "seconds"} ago`
  );
}

export function shortDay(datetime) {
  return format(datetime, "MMM d");
}

export function mediumDay(datetime) {
  return format(datetime, "EEE, MMM d");
}

export function getDateTime(timestamp) {
  const date = new Date(timestamp); // Convert timestamp to milliseconds and create Date object

  const dateString = format(date, "yyyy-MM-dd HH:mm:ss"); //dateFormatter.format(date); // Format date string using user's locale

  return `${dateString}`;
}

function checkTickPrint(i, length, timestamp) {
  const date = toDate(timestamp).getDate();
  // always print
  // if the tick is first of ticks
  if (i === 0) {
    return true;
  }
  // print 1 or 15
  // if the tick is not near first or last
  if (date === 1) {
    return i > 3 && i < length - 4;
  }

  return false;
}

export function xTimestampAxis(datetimes) {
  return datetimes.map((timestamp, i) => {
    return i === datetimes.length - 1
      ? "Now"
      : checkTickPrint(i, datetimes.length, timestamp)
      ? format(timestamp, "MMM")
      : "";
  });
}

export const isYesterday = (now) => {
  return ({ timestamp }) => {
    return differenceInDays(now, timestamp) === 1;
  };
};
