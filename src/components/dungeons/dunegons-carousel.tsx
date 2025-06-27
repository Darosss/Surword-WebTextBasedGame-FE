import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { FC, useEffect, useState } from "react";
import { CompletedDungeons } from "./types";
import React from "react";
import { useFetch } from "@/hooks/useFetch";
import { FightReportType } from "@/api/types";
import { DungeonActions } from "./dungeon-actions";
import { FightReportDisplay } from "../fight-report";
import { Button } from "../ui/button";
import { useAuthContext } from "../auth";

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
  const [showReport, setShowReport] = useState(false);
  const {
    api: {
      responseData: { data: fightData },
    },
    fetchData: startAFight,
  } = useFetch<StartAFightResponse>(
    {
      url: `dungeons/start-a-fight/1`,
      method: "POST",
    },
    { manual: true }
  );

  const {
    apiUser: { fetchData: fetchUserData },
  } = useAuthContext();

  useEffect(() => {
    if (!fightData) setShowReport(false);

    setShowReport(true);
  }, [fightData]);

  const handleStartAFight = (level: number) => {
    startAFight({ customUrl: `dungeons/start-a-fight/${level}` });
  };

  const IconComponent = icon;
  return (
    <div
      className={cn(
        "relative p-3 sm:p-4 rounded-lg bg-gray-800/50 border overflow-y-auto min-h-[calc(100vh-10rem)] flex flex-col justify-center"
      )}
    >
      {fightData && showReport ? (
        <div className="bg-transparent backdrop-blur-md absolute top-0 bottom-0 left-0 right-0 z-[100]">
          <div>
            <Button
              onClick={() => {
                onConfirmReport();
                fetchUserData();
                setShowReport(false);
              }}
              variant="success"
              className="w-full "
            >
              Confirm
            </Button>
          </div>
          <FightReportDisplay report={fightData} />
        </div>
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
        {completed.length > 1 ? (
          <Carousel
            opts={{ align: "center", loop: completed.length > 3 }}
            className="w-full max-w-full border border-b rounded-md p-4"
          >
            <CarouselContent className="-ml-2 sm:-ml-3 py-2 px-6">
              <CarouselItemContent
                level={currentLevel}
                fightData={fightData}
                canFightDate={canFightDate}
                onClickFight={handleStartAFight}
                onConfirmReport={onConfirmReport}
              />
              {completed.map((completedDng) => (
                <CarouselItemContent
                  key={completedDng.finished + completedDng.level}
                  level={completedDng.level}
                  completed={new Date(completedDng.finished)}
                  fightData={fightData}
                  canFightDate={canFightDate}
                  onClickFight={handleStartAFight}
                  onConfirmReport={onConfirmReport}
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
        ) : null}
      </div>
    </div>
  );
};

type CarouselItemContentProps = {
  level: number;
  completed?: Date;
  fightData: FightReportType | null;
  canFightDate: Date;
  onClickFight: (level: number) => void;
  onConfirmReport: () => void;
};

const CarouselItemContent: FC<CarouselItemContentProps> = ({
  level,
  completed,
  canFightDate,
  onClickFight,
}) => {
  return (
    <CarouselItem className="border rounded-md p-4 pl-2 sm:pl-3 m-1 basis-1/2 md:basis-1/3 lg:basis-1/2 xl:basis-1/3">
      <div>
        {completed && `Defeated dungeon`} Level: {level}
      </div>
      <div>{completed?.toLocaleString()}</div>
      <div>
        <DungeonActions
          canFightDate={canFightDate}
          completed={!!completed}
          onClickFight={() => onClickFight(level)}
        />
      </div>
    </CarouselItem>
  );
};
