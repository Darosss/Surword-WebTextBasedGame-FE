import { FightReportType } from "@/api/types";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import ParticipantCard from "./participant.card";
import { FC } from "react";

type PartyCarouselProps = {
  participants: FightReportType["characters"] | FightReportType["enemies"];
  partyName: string;
  icon: React.ElementType;
  iconColor: string;
  team: 1 | 2;
};

export const PartyCarousel: FC<PartyCarouselProps> = ({
  participants,
  partyName,
  icon,
  iconColor,
  team,
}) => {
  const IconComponent = icon;
  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-lg bg-gray-800/50 border",
        team === 1 ? "border-blue-700/40" : "border-red-700/40"
      )}
    >
      <h2
        className={cn(
          "text-lg sm:text-xl font-semibold mb-3 flex items-center",
          team === 1 ? "text-blue-300" : "text-red-300"
        )}
      >
        <IconComponent className={cn("h-5 w-5 mr-2", iconColor)} /> {partyName}
      </h2>
      {participants.length > 0 ? (
        participants.length > 1 ? (
          <Carousel
            opts={{ align: "start", loop: participants.length > 3 }}
            className="w-full max-w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-3">
              {participants.map((p, index) => (
                <CarouselItem
                  key={JSON.stringify(p.id) + index}
                  className="pl-2 sm:pl-3 basis-1/2 md:basis-1/3 lg:basis-1/2 xl:basis-1/3"
                >
                  <ParticipantCard participant={p} team={team} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {participants.length >
              (typeof window !== "undefined" && window.innerWidth < 1024
                ? 2
                : 3) && ( // Conditional arrows based on items and viewport
              <>
                <CarouselPrevious className="absolute left-[-8px] sm:left-[-12px] top-1/2 -translate-y-1/2 h-7 w-7 bg-gray-700/90 hover:bg-gray-600 border-gray-600 text-gray-300 z-10" />
                <CarouselNext className="absolute right-[-8px] sm:right-[-12px] top-1/2 -translate-y-1/2 h-7 w-7 bg-gray-700/90 hover:bg-gray-600 border-gray-600 text-gray-300 z-10" />
              </>
            )}
          </Carousel>
        ) : (
          <div className="px-2 sm:px-3">
            <ParticipantCard participant={participants[0]} team={team} />
          </div>
        )
      ) : (
        <p className="text-gray-500 text-sm px-2 sm:px-3">
          No participants in this group.
        </p>
      )}
    </div>
  );
};
