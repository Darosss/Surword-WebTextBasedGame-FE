import { ItemStatisticsValues } from "@/api/types";
import { cn } from "@/lib/utils";

interface ItemStatisticLineProps {
  label: string;
  data: ItemStatisticsValues;
}

export function ItemStatisticLine({ label, data }: ItemStatisticLineProps) {
  const statValuePositive = data.value > 0;
  const statValuePercentPositive = data.percentageValue > 0;

  const baseValue = data.value;
  const percentValue = data.percentageValue ? `${data.percentageValue}%` : "";

  const valueColor = statValuePositive
    ? "text-green-400"
    : !statValuePositive
    ? "text-red-400"
    : "text-gray-300";
  const percentValueColor = statValuePercentPositive
    ? "text-green-400"
    : !statValuePercentPositive
    ? "text-red-400"
    : "text-gray-300";

  const formattedLabel = label
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400 w-3/5">{formattedLabel}:</span>
      <span className={cn("font-medium w-1/5", valueColor)}>{baseValue}</span>

      <span className={cn("font-medium w-1/5", percentValueColor)}>
        {percentValue}
      </span>
    </div>
  );
}
