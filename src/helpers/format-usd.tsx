interface FormatUSDProps {
  number: string | null | undefined;
  minDigits?: number;
  maxDigits?: number;
}

export const FormatUSD = ({
  number,
  minDigits = 2,
  maxDigits = 2,
}: FormatUSDProps) => {
  return parseFloat(number || "0").toLocaleString("en-US", {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  });
};
