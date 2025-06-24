import { FightReportStatus } from "@/api/enums";
import { FightReportType } from "@/api/types";
import { FC } from "react";
import { ItemDisplay } from "../items";
import { cn } from "@/lib/utils";

type ResultsAndRewardsProps = {
  gainedExperience: FightReportType["gainedExperience"];
  gainedGold: FightReportType["gainedGold"];
  loot: FightReportType["loot"];
  status: FightReportType["status"];
};
export const ResultsAndRewards: FC<ResultsAndRewardsProps> = ({
  gainedExperience,
  gainedGold,
  loot,
  status,
}) => {
  const resultText = status.charAt(0).toUpperCase() + status.slice(1);
  const isWin = status === FightReportStatus.PLAYER_WIN;
  const isLose = status === FightReportStatus.ENEMY_WIN;
  const resultColor = isWin
    ? "text-green-400"
    : isLose
    ? "text-red-400"
    : "text-yellow-400";
  const resultBg = isWin
    ? "bg-green-900/40 border-green-700/70"
    : isLose
    ? "bg-red-900/40 border-red-700/70"
    : "bg-yellow-900/40 border-yellow-700/70";
  return (
    <>
      <div
        className={cn(
          "p-3 sm:p-4 rounded-md mb-4 text-center border",
          resultBg
        )}
      >
        <h3 className={cn("text-xl sm:text-2xl font-bold", resultColor)}>
          {resultText}!
        </h3>
      </div>
      <div className="space-y-2.5">
        {gainedExperience !== undefined && (
          <p className="text-gray-300">
            Experience Gained:{" "}
            <span className="font-semibold text-green-300">
              +{gainedExperience} XP
            </span>
          </p>
        )}
        {gainedGold !== undefined && (
          <p className="text-gray-300">
            Gold Acquired:{" "}
            <span className="font-semibold text-yellow-300">
              +{gainedGold} G
            </span>
          </p>
        )}
        {loot && loot.length > 0 && (
          <div className="w-full">
            <h4 className="font-semibold text-gray-200 mb-1.5 mt-2">
              Items Dropped:
            </h4>
            <div className={cn("flex justify-center")}>
              {loot.map((item) => (
                <div key={item.id} className="w-20 h-20">
                  <ItemDisplay item={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isWin && loot.length === 0 && (
        <p className="text-gray-400">
          No specific rewards were recorded for this victory.
        </p>
      )}
      {isLose && (
        <p className="text-red-400">Better luck next time, warrior.</p>
      )}
    </>
  );
};
