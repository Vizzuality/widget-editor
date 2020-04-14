function sortHighToLow(a, b) {
  if (a.y > b.y) return -1;
  if (b.y > a.y) return 1;
  return 0;
}

function sortLowToHigh(a, b) {
  if (a.y > b.y) return 1;
  if (b.y > a.y) return -1;
  return 0;
}

export default {
  sortHighToLow,
  sortLowToHigh
};