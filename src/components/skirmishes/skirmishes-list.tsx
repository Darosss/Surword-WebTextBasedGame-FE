"use client";

import styles from "./skirmishes-list.module.scss";
import { useFetch } from "@/hooks/useFetch";
import { CurrentChallenge } from "./current-challenge";
import { ChallengeData, ChoosenChallange } from "./types";
import { FC, useEffect, useState } from "react";
import { FetchingInfo } from "@/components/common";
import { Button } from "../ui/button";

type SkirmishesResponse = {
  challenges: { [id: string]: ChallengeData };
  challengeTimeCompleted: boolean;
  chosenChallenge?: ChoosenChallange;
  chosenChallengeData?: ChallengeData;
  id: string;
};

export const SkirmishesList: FC = () => {
  const {
    api: {
      isPending,
      error,
      responseData: { data },
    },
    fetchData,
  } = useFetch<SkirmishesResponse>({
    url: "your-skirmishes",
    method: "GET",
  });
  const [choosenChallange, setChoosenChallenge] = useState("");
  if (!data || isPending || error) {
    return (
      <FetchingInfo isPending={isPending} error={error} refetch={fetchData} />
    );
  }

  return (
    <div className={styles.skirmishesWrapper}>
      <div className={styles.skirmishesList}>
        {data.chosenChallenge && data.chosenChallengeData ? (
          <CurrentChallenge
            chosenChallenge={data.chosenChallenge}
            chosenChallengeData={data.chosenChallengeData}
            onConfirmReport={fetchData}
            onCancel={fetchData}
          />
        ) : (
          <>
            <div className={styles.skirmishDataWrapper}>
              {Object.entries(data.challenges).map((value) => (
                <SkirmishesData
                  key={value[0]}
                  data={value}
                  onChoose={(id) => setChoosenChallenge(id)}
                  choosen={choosenChallange === value[0]}
                />
              ))}
            </div>
            <div className={styles.challengeDataActionWrapper}>
              {choosenChallange ? (
                <ChallengeDataAction
                  challangeId={choosenChallange}
                  onStart={() => {
                    fetchData();
                    setChoosenChallenge("");
                  }}
                />
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

type SkirmishesDataProps = {
  data: [string, ChallengeData];
  onChoose: (id: string) => void;
  choosen?: boolean;
};

const SkirmishesData = ({
  data: [id, value],
  onChoose,
  choosen,
}: SkirmishesDataProps) => {
  return (
    <>
      <div
        className={`${styles.skirmishChallenges} ${
          choosen ? styles.choosen : ""
        }`}
        onClick={() => onChoose(id)}
      >
        <div>{value.name}</div>
        <div>
          <span>({value.difficulty})</span>
        </div>
      </div>
    </>
  );
};

type ChallengeDataActionProps = {
  challangeId: string;
  onStart: () => void;
};

const ChallengeDataAction = ({
  challangeId,
  onStart,
}: ChallengeDataActionProps) => {
  const {
    api: {
      isPending,
      error,
      responseData: { data },
    },
    fetchData,
  } = useFetch<String>(
    {
      url: `start-challenge/${challangeId}`,
      method: "POST",
    },
    { manual: true }
  );

  useEffect(() => {
    if (data) onStart();
  }, [data, onStart]);

  return (
    <div className={styles.challengeDataAction}>
      <div>TODO: if backend will have desc. soon description :P </div>

      <div className={styles.challengeActions}>
        <Button onClick={() => fetchData()} variant="success">
          Start
        </Button>
      </div>
    </div>
  );
};
