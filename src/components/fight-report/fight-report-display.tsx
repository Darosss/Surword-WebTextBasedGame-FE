import React, { FC } from "react";
import { FightReportType } from "@/api/types";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import {
  Users,
  Shield,
  Hourglass,
  ScrollText,
  Trophy,
  Activity,
} from "lucide-react";
import { CombatTurnActions } from "./combat-turn-actions";
import { PartyCarousel } from "./party-carousel";
import { ResultsAndRewards } from "./results-and-rewards";
import { FightOverview } from "./fight-overview";

type FightReportDisplayProps = {
  report: FightReportType;
};

export const FightReportDisplay: FC<FightReportDisplayProps> = ({ report }) => {
  const {
    characters,
    enemies,
    gainedExperience,
    gainedGold,
    loot,
    status,
    turnsReports,
  } = report;

  const fightTitle = "Fight!";

  return (
    <div className="p-3 sm:p-4 md:p-6 mx-auto bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-700/60 shadow-2xl">
      {fightTitle && (
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-4 sm:mb-6 text-center border-b border-gray-700/80 pb-3 sm:pb-4">
          {fightTitle}
        </h1>
      )}

      <Accordion
        type="multiple"
        defaultValue={["participants", "combat-log", "results"]}
        className="w-full space-y-3"
      >
        <AccordionItem
          value="results"
          className="border border-gray-700/70 rounded-lg overflow-hidden bg-gray-800/30"
        >
          <AccordionTrigger className="text-md sm:text-lg font-semibold text-gray-200 hover:no-underline hover:bg-gray-700/40 px-4 py-3 w-full hover:cursor-pointer">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 mr-2.5 text-yellow-400" />
              Results & Rewards
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-gray-800/20 p-4 text-sm border-t border-gray-700/50">
            <ResultsAndRewards
              gainedExperience={gainedExperience}
              gainedGold={gainedGold}
              status={status}
              loot={loot}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="participants"
          className="border border-gray-700/70 rounded-lg overflow-hidden bg-gray-800/30"
        >
          <AccordionTrigger className="text-md sm:text-lg font-semibold text-gray-200 hover:no-underline hover:bg-gray-700/40 px-4 py-3 w-full hover:cursor-pointer">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2.5 text-gray-400" />
              Participants
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-gray-800/20 p-4 text-sm border-t border-gray-700/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <PartyCarousel
                participants={characters}
                partyName="Player Party"
                icon={Users}
                iconColor="text-blue-400"
                team={1}
              />
              <PartyCarousel
                participants={enemies}
                partyName="Enemy Forces"
                icon={Shield}
                iconColor="text-red-400"
                team={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="overview"
          className="border border-gray-700/70 rounded-lg overflow-hidden bg-gray-800/30"
        >
          <AccordionTrigger className="text-md sm:text-lg font-semibold text-gray-200 hover:no-underline hover:bg-gray-700/40 px-4 py-3 w-full hover:cursor-pointer">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2.5 text-gray-400" />
              Fight Overview
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-gray-800/20 p-4 text-sm border-t border-gray-700/50">
            <FightOverview
              turnsCount={turnsReports.length}
              timestamp={new Date().getTime()}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="combat-log"
          className="border border-gray-700/70 rounded-lg overflow-hidden bg-gray-800/30"
        >
          <AccordionTrigger className="text-md sm:text-lg font-semibold text-gray-200 hover:no-underline hover:bg-gray-700/40 px-4 py-3 w-full hover:cursor-pointer">
            <div className="flex items-center">
              <ScrollText className="h-5 w-5 mr-2.5 text-gray-400" />
              Combat Log
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-gray-800/20 p-0">
            <div className="overflow-auto h-[300px] sm:h-[400px] border-t border-gray-700/50">
              {turnsReports.length > 0 ? (
                turnsReports.map((entry, index) => (
                  <CombatTurnActions
                    key={entry.turnNumber + index}
                    entry={entry}
                  />
                ))
              ) : (
                <p className="p-4 text-gray-500 text-center">
                  No combat actions recorded.
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
