interface FormatUSDProps {
  number: string;
  minDigits?: number;
  maxDigits?: number;
}

export const FormatUSD = ({
  number,
  minDigits = 2,
  maxDigits = 2,
}: FormatUSDProps) => {
  return parseFloat(number).toLocaleString("en-US", {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  });
};
