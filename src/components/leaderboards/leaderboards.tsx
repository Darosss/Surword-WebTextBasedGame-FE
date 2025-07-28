"use client";

import { FC, useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { LeaderboardsData, LeaderboardsResponse } from "@/api/types";
import { FetchingInfo } from "../common";
import { LeaderboardsCategories } from "@/api/enums";
import { useRouter } from "next/navigation";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TrendingUp, Shield } from "lucide-react";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { RankBadge } from "./rank-badge";
import { formatTime } from "@/utils/utils";
import Link from "next/link";
import { useAuthContext } from "../auth";

export const Leaderboards: FC = () => {
  const { user } = useAuthContext();
  const [currentCategory, setCurrentCategory] = useState(
    LeaderboardsCategories.LEVELS
  );
  const {
    api: {
      isPending,
      error,
      responseData: { data: currentLeaderboardData },
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

  if (!currentLeaderboardData || error)
    return <FetchingInfo isPending={isPending} error={error} />;
  return (
    <div>
      <div className="flex bg-gray-800/50 rounded-md justify-end gap-2 p-2">
        <div>Next refresh: </div>
        <div>
          {nextRefreshTime
            ? `${formatTime(leaderboardsRemainingTimeRefresh)}`
            : ""}
        </div>
      </div>
      <Tabs value={currentCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 gap-2 bg-gray-800/50 h-12">
          <TabsTrigger
            value={LeaderboardsCategories.LEVELS}
            onClick={() => setCurrentCategory(LeaderboardsCategories.LEVELS)}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">
              {LeaderboardsCategories.LEVELS}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value={LeaderboardsCategories.DUNGEONS}
            onClick={() => setCurrentCategory(LeaderboardsCategories.DUNGEONS)}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">
              {LeaderboardsCategories.DUNGEONS}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContentWrapper
          title="Level Rankings"
          description="The most experienced adventurers in the realm"
          tabContentValue={LeaderboardsCategories.LEVELS}
        >
          {currentLeaderboardData.data?.map((user) => (
            <CommonLeaderboardData
              key={user.userId}
              data={user}
              category={LeaderboardsCategories.LEVELS}
              currentUser={user.username}
            />
          ))}
        </TabsContentWrapper>
        <TabsContentWrapper
          title="Dungeons Rankings"
          description="The most experienced dungeon explorers in the realm"
          tabContentValue={LeaderboardsCategories.DUNGEONS}
        >
          {currentLeaderboardData.data?.map((user) => (
            <CommonLeaderboardData
              key={user.userId}
              data={user}
              category={LeaderboardsCategories.DUNGEONS}
              currentUser={user.username}
            />
          ))}
        </TabsContentWrapper>
      </Tabs>
    </div>
  );
};

type TabsContentWrapperProps = {
  tabContentValue: LeaderboardsCategories;
  title: string;
  description: string;
  children: React.ReactNode;
};

const TabsContentWrapper: FC<TabsContentWrapperProps> = ({
  tabContentValue,
  children,
  title,
  description,
}) => {
  return (
    <TabsContent value={tabContentValue}>
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-300">
            <TrendingUp className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">{children}</div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

type CommonLeaderboardDataProps = {
  data: LeaderboardsData;
  category: LeaderboardsCategories;
  currentUser: string;
};

const CommonLeaderboardData: FC<CommonLeaderboardDataProps> = ({
  data,
  category,
  currentUser,
}) => {
  const getValueDesc = () => {
    switch (category) {
      case LeaderboardsCategories.LEVELS:
        return "Level";
      case LeaderboardsCategories.DUNGEONS:
        return "Max level";
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
        data.username === currentUser
          ? "bg-blue-900/30 border border-blue-700/50"
          : "bg-gray-900/30 hover:bg-gray-900/50"
      }`}
    >
      <div className="flex items-center gap-4">
        <RankBadge rank={data.place} />
        <div>
          <p
            className={`font-semibold ${
              data.username === currentUser ? "text-blue-300" : "text-gray-200"
            }`}
          >
            <Link href={`overview/user/${data.userId}`}>{data.username}</Link>
            {data.username === currentUser && (
              <span className="text-blue-400 ml-2">(You)</span>
            )}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-white">
          {getValueDesc()} {data.value}
        </p>
      </div>
    </div>
  );
};
