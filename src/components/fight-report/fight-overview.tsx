import { CalendarDays, Hourglass } from "lucide-react";
import { FC } from "react";

type FightOverviewProps = {
  turnsCount: number;
  timestamp: number;
};

export const FightOverview: FC<FightOverviewProps> = ({
  timestamp,
  turnsCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <p className="text-gray-300 flex items-center">
        <CalendarDays className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
        Date:{" "}
        <span className="font-medium text-gray-100 ml-1">
          {new Date(timestamp).toLocaleDateString()}
        </span>
      </p>
      <p className="text-gray-300 flex items-center">
        <Hourglass className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
        Duration:{" "}
        <span className="font-medium text-gray-100 ml-1">
          {turnsCount} turns
        </span>
      </p>
    </div>
  );
};
