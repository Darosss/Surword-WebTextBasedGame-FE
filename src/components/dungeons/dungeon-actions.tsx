import { formatTime, getRemainingTimeFromDateToDate } from "@/utils/utils";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { LucideLoader } from "lucide-react";

type DungeonActionsProps = {
  canFightDate: Date;
  onClickFight: () => void;
  completed: boolean;
  isPending?: boolean;
};

export const DungeonActions: FC<DungeonActionsProps> = ({
  completed,
  canFightDate,
  onClickFight,
  isPending,
}) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    //TODO: move this out of this -> context / or somewhere
    const remainingTimeMs = getRemainingTimeFromDateToDate({
      timestamp: Date.now(),
      toTimestamp: Number(new Date(canFightDate.getTime()).getTime()),
    });
    if (remainingTimeMs <= 0) return;
    setRemainingTime(remainingTimeMs);
    const intervalId = setInterval(() => {
      setRemainingTime((prevCounter) => {
        const newTime = Math.max(0, prevCounter - 1000);
        if (newTime === 0) {
          clearInterval(intervalId);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [canFightDate]);

  return (
    <div>
      {remainingTime != 0 ? (
        formatTime(remainingTime)
      ) : (
        <Button
          disabled={isPending}
          variant={(completed && "warning") || "destructive"}
          onClick={onClickFight}
          className="w-full"
        >
          {isPending ? <LucideLoader /> : "Fight"}
        </Button>
      )}
    </div>
  );
};
