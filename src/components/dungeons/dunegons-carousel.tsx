import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { FC } from "react";
import { CompletedDungeons } from "./types";
import React from "react";
import { useFetch } from "@/hooks/useFetch";
import { FightReportType } from "@/api/types";
import { DungeonActions } from "./dungeon-actions";
import { useAuthContext } from "../auth";
import { FightReport } from "../fight-report/fight-report";

type PartyCarouselProps = {
  currentLevel: number;
  completed: CompletedDungeons[];
  icon: React.ElementType;
  iconColor: string;
  canFightDate: Date;
  onConfirmReport: () => void;
};

type StartAFightResponse = FightReportType;
export const DungeonsCarousel: FC<PartyCarouselProps> = ({
  icon,
  completed,
  iconColor,
  canFightDate,
  onConfirmReport,
  currentLevel,
}) => {
  const {
    api: {
      responseData: { data: fightData },
      isPending,
    },
    fetchData: startAFight,
  } = useFetch<StartAFightResponse>(
    {
      url: `dungeons/start-a-fight/1`,
      method: "POST",
    },
    { manual: true }
  );

  const { fetchProfile } = useAuthContext();

  const handleStartAFight = (level: number) => {
    startAFight({ customUrl: `dungeons/start-a-fight/${level}` });
  };

  const IconComponent = icon;
  return (
    <div
      className={cn(
        "relative p-3 sm:p-4 sm:pt-0 rounded-lg bg-gray-800/50 border overflow-y-auto min-h-[calc(100vh-10rem)] flex flex-col justify-center"
      )}
    >
      {fightData ? (
        <FightReport
          report={fightData}
          onClickConfirm={() => {
            onConfirmReport();
            fetchProfile();
          }}
        />
      ) : null}
      <h2
        className={cn(
          "text-lg sm:text-xl font-semibold mb-3 flex items-center"
        )}
      >
        <IconComponent className={cn("h-5 w-5 mr-2", iconColor)} />
      </h2>
      <div className="grid items-center grid-cols-1  sm:gap-6 mb-6 sm:mb-8">
        {" "}
        <Carousel
          opts={{ align: "center", loop: completed.length > 3 }}
          className="w-full max-w-full border border-b rounded-md p-4"
        >
          <CarouselContent className="-ml-2 sm:-ml-3 py-2 px-6">
            <CarouselItemContent
              level={currentLevel}
              canFightDate={canFightDate}
              isPending={!!isPending}
              onClickFight={handleStartAFight}
            />
            {completed.map((completedDng) => (
              <CarouselItemContent
                key={completedDng.finished + completedDng.level}
                level={completedDng.level}
                completed={new Date(completedDng.finished)}
                canFightDate={canFightDate}
                isPending={!!isPending}
                onClickFight={handleStartAFight}
              />
            ))}
          </CarouselContent>
          {completed.length >
            (typeof window !== "undefined" && window.innerWidth < 1024
              ? 2
              : 3) && (
            <>
              <CarouselPrevious className="absolute left-[-8px] sm:left-[-12px] top-1/2 -translate-y-1/2 h-7 w-7 bg-gray-700/90 hover:bg-gray-600 border-gray-600 text-gray-300 z-10" />
              <CarouselNext className="absolute right-[-8px] sm:right-[-12px] top-1/2 -translate-y-1/2 h-7 w-7 bg-gray-700/90 hover:bg-gray-600 border-gray-600 text-gray-300 z-10" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};

type CarouselItemContentProps = {
  level: number;
  completed?: Date;
  canFightDate: Date;
  isPending: boolean;
  onClickFight: (level: number) => void;
};

const CarouselItemContent: FC<CarouselItemContentProps> = ({
  level,
  completed,
  canFightDate,
  isPending,
  onClickFight,
}) => {
  return (
    <CarouselItem className="border rounded-md p-4 pl-2 sm:pl-3 m-1 basis-1/2 md:basis-1/3 lg:basis-1/2 xl:basis-1/3 flex flex-col justify-between">
      <div>
        {completed && `Defeated dungeon`} Level: {level}
      </div>
      <div>{completed?.toLocaleString()}</div>
      <div>
        <DungeonActions
          canFightDate={canFightDate}
          completed={!!completed}
          onClickFight={() => onClickFight(level)}
          isPending={isPending}
        />
      </div>
    </CarouselItem>
  );
};
