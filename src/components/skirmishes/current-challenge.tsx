import { FC, useEffect, useState } from "react";
import { ChallengeData, ChoosenChallange } from "./types";
import { formatTime } from "@/utils/utils";
import { useFetch } from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { FightReportType } from "@/api/types";
import { FightReportDisplay } from "@/components/fight-report";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useAuthContext } from "@/components/auth";

type CurrentChallengeProps = {
  chosenChallenge: ChoosenChallange;
  chosenChallengeData: ChallengeData;

  onConfirmReport: () => void;
  onCancel: () => void;
};

type CurrentChallengeResponse = FightReportType;

export const CurrentChallenge: FC<CurrentChallengeProps> = ({
  chosenChallenge,
  chosenChallengeData,
  onConfirmReport,
  onCancel,
}) => {
  const [showReport, setShowReport] = useState(false);
  const {
    api: {
      isPending,
      error,
      responseData: { data },
    },
    fetchData,
  } = useFetch<CurrentChallengeResponse>(
    {
      url: "current-challenge",
      method: "GET",
    },
    { manual: true }
  );
  const { fetchProfile } = useAuthContext();

  const remainingTime = useCountdownTimer({
    toTimestamp: chosenChallenge.timestamp,
  });

  useEffect(() => {
    if (remainingTime === 0) fetchData();
  }, [fetchData, remainingTime]);

  useEffect(() => {
    if (data) {
      setShowReport(true);
    }
  }, [data]);

  return (
    <div>
      {data && showReport ? (
        <div className="bg-transparent backdrop-blur-md absolute top-0 bottom-0 left-0 right-0 z-[100]">
          <div className="sticky top-0 z-[101]">
            <Button
              onClick={() => {
                onConfirmReport();
                fetchProfile();
                setShowReport(false);
              }}
              variant="success"
              className="w-full "
            >
              Confirm
            </Button>
          </div>
          <FightReportDisplay report={data} />
        </div>
      ) : (
        <div>
          <div>
            <h2 className="text-2xl font-bold text-yellow-300 border-b border-gray-600 pb-3 mb-4">
              {chosenChallengeData.name}
            </h2>
            <h3 className="text-lg font-bold text-yellow-300 border-b border-gray-600 pb-3 mb-4">
              {"("}
              {chosenChallengeData.difficulty}
              {")"}
            </h3>

            <h3 className="text-lg font-bold text-yellow-300 border-b border-gray-600 pb-3 mb-4">
              {formatTime(remainingTime)}
            </h3>
            <CancelCurrentChallengeButton onCancel={onCancel} />
          </div>
        </div>
      )}
    </div>
  );
};

type CancelCurrentChallengeButtonProps = {
  onCancel: () => void;
};

const CancelCurrentChallengeButton = ({
  onCancel,
}: CancelCurrentChallengeButtonProps) => {
  const {
    api: {
      isPending,
      error,
      responseData: { data },
    },
    fetchData,
  } = useFetch(
    {
      url: "cancel-current-challenge",
      method: "POST",
    },
    { manual: true }
  );

  const handleOnCancel = async () => {
    const data = await fetchData();

    if (data) onCancel();
  };
  return (
    <Button onClick={() => handleOnCancel()} variant="destructive">
      {isPending ? "Wait" : "Cancel"}
    </Button>
  );
};
