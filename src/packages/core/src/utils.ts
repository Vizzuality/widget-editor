import { MONTHS } from "./constants";

export const parseDate = (date: any) => {
  const isYear = date.toString().length === 4;
  if (isYear) {
    return date;
  }
  const dateParser = new Date(date);
  date = `${dateParser.getDate()} ${MONTHS[dateParser.getMonth()]}`;

  return date;
}

export const isDate = (date: any) => {
  return typeof date === 'number' || !isNaN(Date.parse(date))
}

export const parseData = (data: any) => {
  return data
    ? data.map((d: any) => {
        if (isDate(d.x)) {
         d.x = parseDate(d.x);
        }
        return d;
      })
    : [];
};
