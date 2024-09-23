// function to format numeric values to OSRS standard
export default function formatShort(number) {
  const digits = 2;

  const lookup = [
    { value: 1, symbol: " gp" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const newNumber = lookup.findLast((item) => Math.abs(number) >= item.value);

  return newNumber
    ? (number / newNumber.value)
        .toFixed(digits)
        .replace(regexp, "")
        .concat(newNumber.symbol)
    : "0";
}
