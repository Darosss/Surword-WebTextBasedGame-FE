"use client";

import { useFetch } from "@/hooks/useFetch";
import { FC, useEffect, useState } from "react";
import { DungeonsResponse } from "./types";
import { FetchingInfo } from "../common";
import { DungeonsCarousel } from "./dunegons-carousel";
import { Castle } from "lucide-react";

export const Dungeons: FC = () => {
  const {
    api: {
      isPending,
      error,
      responseData: { data },
    },
    fetchData,
  } = useFetch<DungeonsResponse>({
    url: "dungeons",
    method: "GET",
  });
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    if (data) setCurrentLevel(data.currentLevel);
  }, [data]);

  if (!data || isPending || error) {
    return (
      <FetchingInfo isPending={isPending} error={error} refetch={fetchData} />
    );
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] overflow-hidden">
      <div>
        <h2 className="text-xl font-bold text-yellow-300 border-b border-gray-600 pb-3 mb-4">
          Current finished level: {currentLevel}
        </h2>
      </div>

      <DungeonsCarousel
        currentLevel={data.currentLevel}
        completed={[...data.completedDungeons].reverse()}
        icon={Castle}
        iconColor={""}
        canFightDate={new Date(data.canFightDate)}
        onConfirmReport={fetchData}
      />
    </div>
  );
};
