"use client";

import { FC, useEffect, useState } from "react";
import styles from "./leaderboards.module.scss";
import { useFetch } from "@/hooks/useFetch";
import { LeaderboardsResponse } from "@/api/types";
import { FetchingInfo } from "../common";
import { LeaderboardsCategories } from "@/api/enums";
import { useRouter } from "next/navigation";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { formatTime } from "@/utils/utils";
import { Button } from "../ui/button";

export const Leaderboards: FC = () => {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState(
    LeaderboardsCategories.LEVELS
  );
  const {
    api: {
      isPending,
      error,
      responseData: { data },
    },
    fetchData,
  } = useFetch<LeaderboardsResponse>(
    {
      url: `leaderboards/category/${currentCategory}`,
      method: "GET",
    },
    { manual: true }
  );
  const {
    api: {
      responseData: { data: nextRefreshTime },
    },
  } = useFetch<string>({
    url: `leaderboards/next-refresh-time`,
    method: "GET",
  });

  const leaderboardsRemainingTimeRefresh = useCountdownTimer({
    toTimestamp: nextRefreshTime || undefined,
  });

  useEffect(() => {
    fetchData();
  }, [currentCategory, fetchData]);

  useEffect(() => {
    if (leaderboardsRemainingTimeRefresh === 0) {
      fetchData();
    }
  }, [leaderboardsRemainingTimeRefresh, fetchData]);

  if (!data || error)
    return <FetchingInfo isPending={isPending} error={error} />;
  return (
    <div className={styles.leaderboardsWrapper}>
      <div className={styles.nextRefreshTime}>
        <div>Next refresh: </div>
        <div>
          {nextRefreshTime
            ? `${formatTime(leaderboardsRemainingTimeRefresh)}`
            : ""}
        </div>
      </div>
      <div className={styles.leaderboarsCategoriesWrapper}>
        {Object.values(LeaderboardsCategories).map((category) => (
          <Button
            key={category}
            variant={category === data.category ? "success" : "default"}
            onClick={() => setCurrentCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className={styles.leaderboardDataWrapper}>
        <div>
          <div> Nr. </div>
          <div> Username </div>
          <div> Value </div>
        </div>
        {data.data?.map((leaderboardData) => (
          <div key={leaderboardData.place + leaderboardData.userId}>
            <div>{leaderboardData.place}</div>
            <div>
              <Button
                onClick={() =>
                  router.push(`overview/user/${leaderboardData.userId}`)
                }
              >
                {leaderboardData.username}
              </Button>
            </div>
            <div>{leaderboardData.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
