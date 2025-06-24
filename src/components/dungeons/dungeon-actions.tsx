import { formatTime, getRemainingTimeFromDateToDate } from "@/utils/utils";
import { FC, useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { FightReportDisplay } from "@/components/fight-report";
import { FightReportType } from "@/api/types";
import { useAuthContext } from "@/components/auth";
import { Button } from "../ui/button";

type DungeonActionsProps = {
  dungeonLevel: number;
  canFightDate: Date;
  onConfirmReport: () => void;
};

type StartAFightResponse = FightReportType;

export const DungeonActions: FC<DungeonActionsProps> = ({
  dungeonLevel,
  canFightDate,
  onConfirmReport,
}) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const {
    api: {
      isPending,
      error,
      responseData: { data },
    },
    fetchData,
  } = useFetch<StartAFightResponse>(
    {
      url: `dungeons/start-a-fight/${dungeonLevel}`,
      method: "POST",
    },
    { manual: true }
  );
  const {
    apiUser: { fetchData: fetchUserData },
  } = useAuthContext();

  useEffect(() => {
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

  useEffect(() => {
    if (data) {
      fetchUserData();
      setShowReport(true);
    }
  }, [data, fetchUserData]);

  return (
    <div>
      {data && showReport ? (
        <div className="bg-transparent backdrop-blur-md absolute top-0 bottom-0 left-0 right-0">
          <FightReportDisplay report={data} />

          <div>
            <Button
              onClick={() => {
                onConfirmReport();
                setShowReport(false);
              }}
              variant="success"
              className="w-full "
            >
              Confirm
            </Button>
          </div>
        </div>
      ) : remainingTime != 0 ? (
        formatTime(remainingTime)
      ) : (
        <Button variant="destructive" onClick={() => fetchData()}>
          Fight
        </Button>
      )}
    </div>
  );
};
