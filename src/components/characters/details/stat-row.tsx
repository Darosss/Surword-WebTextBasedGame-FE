import { TrainBaseStatisticButton } from "@/components/characters/details/statistics";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";
import { HelpCircle } from "lucide-react";

type StatsRowProps = {
  label: string;
  value: string | number;
  isTrainable?: boolean;
  tooltip?: React.ReactNode;
};

export const StatRow = ({
  label,
  value,
  isTrainable = false,
  tooltip: tooltipText,
}: StatsRowProps) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-700/50 last:border-b-0">
    <div className="flex items-center gap-1.5">
      <span className="text-gray-300 text-sm">{label}</span>
      {tooltipText && (
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger>
            <HelpCircle className="hover:brightness-75 hover:cursor-help" />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-xs flex justify-between gap-4 bg-primary p-2 pl-6 pr-6 rounded-md">
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
);
