import { cn } from "@/lib/utils";
import { ItemStatisticLine } from "./item-statistic-line";
import { rarityStyles } from "./utils";
import { InventoryItemType } from "@/api/types";
import { isConsumableItem } from "@/api/utils";
import { getFormattedName } from "@/utils/utils";

interface ItemHoverCardContentDisplayProps {
  item: InventoryItemType;
}

export function ItemHoverCardContentDisplay({
  item,
}: ItemHoverCardContentDisplayProps) {
  const currentRarityStyle = rarityStyles[item.rarity];

  return (
    <div
      className={cn(
        "w-72 sm:w-80 rounded-lg shadow-2xl border text-gray-200 p-3.5 space-y-2.5",
        currentRarityStyle.border,
        currentRarityStyle.bg,
        "bg-opacity-90 backdrop-blur-sm"
      )}
    >
      <h3
        className={cn(
          "text-md font-semibold leading-tight",
          currentRarityStyle.text
        )}
      >
        {"prefix" in item && getFormattedName(item.prefix)}{" "}
        <span className="brightness-150">
          {getFormattedName(item.name, "allCapital")}{" "}
        </span>{" "}
        {"suffix" in item && getFormattedName(item.suffix, "original")}
      </h3>

      <hr className="border-gray-700/70" />

      <div className="space-y-1.5">
        {item.statistics?.baseStatistics &&
          Object.keys(item.statistics.baseStatistics).length > 0 && (
            <div className="space-y-0.5">
              {Object.entries(item.statistics.baseStatistics).map(
                ([key, value]) => (
                  <ItemStatisticLine
                    key={`base-${key}`}
                    label={key}
                    data={value}
                  />
                )
              )}
            </div>
          )}
        {item.statistics?.additionalStatistics &&
          Object.keys(item.statistics.additionalStatistics).length > 0 && (
            <div className="space-y-0.5 mt-1">
              {Object.entries(item.statistics.additionalStatistics).map(
                ([key, value]) => (
                  <ItemStatisticLine
                    key={`add-${key}`}
                    label={key}
                    data={value}
                  />
                )
              )}
            </div>
          )}
        {isConsumableItem(item) && (
          <ItemStatisticLine
            label="Health Gain"
            data={{
              name: "hpGain",
              value: item.hpGain || 0,
              percentageValue: 0,
            }}
          />
        )}
      </div>

      {(item.statistics || isConsumableItem(item)) && (
        <hr className="border-gray-700/70" />
      )}

      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-gray-400">
        <span>
          Level: <span className="text-gray-100 font-medium">{item.level}</span>
        </span>
        <span>
          Value:{" "}
          <span className="text-yellow-300 font-medium">{item.value} G</span>
        </span>
        <span>
          Type:{" "}
          <span className="text-gray-100">{getFormattedName(item.type)}</span>
        </span>
        <span>
          Subtype:{" "}
          <span className="text-gray-100">
            {getFormattedName(item.subtype)}
          </span>
        </span>
        <span className="col-span-2">
          Rarity:{" "}
          <span className={cn("font-medium", currentRarityStyle.text)}>
            {getFormattedName(item.rarity)}
          </span>
        </span>
        {item.upgradePoints !== undefined && (
          <span>
            Upgrades:{" "}
            <span className="text-gray-100 font-medium">
              {item.upgradePoints}
            </span>
          </span>
        )}
        <span>
          Weight:{" "}
          <span className="text-gray-100 font-medium">
            {item.weight.toFixed(1)}
          </span>
        </span>
      </div>

      {item.description && (
        <>
          <hr className="border-gray-700/70" />
          <p className="text-[11px] text-gray-500 italic leading-snug">
            {item.description}
          </p>
        </>
      )}
    </div>
  );
}
