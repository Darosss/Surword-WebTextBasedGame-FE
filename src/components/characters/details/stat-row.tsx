import { TrainBaseStatisticButton } from "@/components/characters/details/statistics";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { HelpCircle } from "lucide-react";

type StatsRowProgress = {
  max: number;
  effective: number;
};

type StatsRowProps = {
  label: string;
  value: string | number;
  progress?: StatsRowProgress;
  isTrainable?: boolean;
  tooltip?: React.ReactNode;
};

export const StatRow = ({
  label,
  value,
  isTrainable = false,
  tooltip: tooltipText,
  progress,
}: StatsRowProps) => {
  const effectiveToMaxPercentage = progress
    ? (progress.effective / progress.max) * 100
    : 0;
  return (
    <div className="flex flex-col border-b border-gray-700/50 py-2 last:border-b-0 gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-300 text-sm">{label}</span>
          {tooltipText && (
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger>
                <HelpCircle className="hover:brightness-75 hover:cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent
                sideOffset={0}
                className="z-[102] bg-current border-none shadow-none w-auto"
              >
                <div className="w-xs flex justify-between gap-4 bg-opacity-90 backdrop-blur-sm p-2 rounded-md border border-blue-500">
                  <hr className="border-blue-700/70" />
                  <div className="w-full space-y-1 ">{tooltipText}</div>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white text-sm">{value}</span>
          {isTrainable && (
            <TrainBaseStatisticButton
              statisticName={label}
              onSuccessTrain={() => {
                //TODO: add fetching + updating
              }}
            />
          )}
        </div>
      </div>
      {progress && (
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-sky-500 to-sky-200 h-1 rounded-full"
            style={{ width: `${effectiveToMaxPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
