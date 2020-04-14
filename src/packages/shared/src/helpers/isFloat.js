export default function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}
