import { FC, useEffect } from "react";
import { ChallengeData, ChoosenChallange } from "./types";
import { formatTime } from "@/utils/utils";
import { useFetch } from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { FightReportType } from "@/api/types";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useAuthContext } from "@/components/auth";
import { FightReport } from "../fight-report/fight-report";

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

  return (
    <div>
      {data ? (
        <FightReport
          report={data}
          onClickConfirm={() => {
            onConfirmReport();
            fetchProfile();
          }}
        />
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
