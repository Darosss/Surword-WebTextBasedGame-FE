import { FC, useEffect } from "react";
import styles from "./current-challenge.module.scss";
import { ChallengeData, ChoosenChallange } from "../types";
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
  const {
    apiUser: { fetchData: fetchUserData },
  } = useAuthContext();

  const remainingTime = useCountdownTimer({
    toTimestamp: chosenChallenge.timestamp,
  });

  useEffect(() => {
    if (remainingTime === 0) fetchData();
  }, [fetchData, remainingTime]);

  useEffect(() => {
    if (data) fetchUserData();
  }, [data, fetchUserData]);

  return (
    <div className={styles.currentChallengeWrapper}>
      {data ? (
        <div className={styles.reportDisplayWrapper}>
          <FightReportDisplay report={data} />

          <div className={styles.reportButtonConfirm}>
            <Button onClick={onConfirmReport} variant="success">
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.skirmishCountdown}>
          <div>
            <div>{chosenChallengeData.name}</div>
            <div>
              <span>
                {"("}
                {chosenChallengeData.difficulty}
                {")"}
              </span>
            </div>
          </div>
          <div>
            <div>{formatTime(remainingTime)}</div>
          </div>
          <div>
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
