import { MONTHS } from "../constants";

export const parseData = (data) => {
  return data
    ? data.map((d) => {
        if (Date.parse(d.x)) {
          // XXX : If date is "year" just return the year
          if (typeof d.x === "number" && d.x.toString().length !== 4) {
            const date = new Date(d.x);
            d.x = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
          }
        }
        return d;
      })
    : [];
};
