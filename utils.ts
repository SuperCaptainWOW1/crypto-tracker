export function toFixedDigits(
  numberValue: string | number,
  requiredLength: number
) {
  const numberString = numberValue.toString();
  const number = parseFloat(numberString);

  const [wholeDigits, fractionDigits] = numberString.split(".");

  if (!fractionDigits) return number;

  const numberLength = wholeDigits.length + fractionDigits.length;

  if (numberLength > requiredLength) {
    const difference = numberLength - requiredLength;

    const newFractionDigitsLength = fractionDigits.length - difference;

    if (newFractionDigitsLength > 0) {
      return parseFloat(number.toFixed(newFractionDigitsLength));
    } else {
      return parseFloat(number.toFixed(0));
    }
  } else {
    return number;
  }
}
