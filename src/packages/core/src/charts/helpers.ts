import { MONTHS } from "../constants";

export const parseData = data => {
  return data ? data.map(d => {
    if (Date.parse(d.x)) {
      const date = new Date(d.x);
      d.x = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
    }
    return d;
  }) : [];
}
