"use client";
import {
  CharacterTypesAlias,
  HeroAdditionalStatistics,
  HeroAdditionalStatisticsValues,
  HeroBaseStatistics,
  HeroBaseStatisticsValues,
} from "@/api/types";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchBackendApi } from "@/api/fetch";
import { isMercenaryCharacter } from "@/api/utils";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, PlusCircle } from "lucide-react";
import { StatRow } from "./stat-row";
import { CharacterAvatar } from "../characters/character-avatar";

type BaseStatisticsProps = {
  statistics?: HeroBaseStatistics;
  canTrain?: {
    onSuccesTrain: () => void;
  };
};

export const BaseStatistics: FC<BaseStatisticsProps> = ({
  statistics,
  canTrain,
}) => {
  const Tooltip = ({
    statValues,
  }: {
    statValues: HeroBaseStatisticsValues;
  }) => {
    return Object.keys(statValues).map((key) => {
      return (
        <div
          key={key}
          className={
            "w-full flex items-center justify-between py-2.5 border-b border-gray-700/100 last:border-b-0"
          }
        >
          <div className="flex items-center gap-1.5 pl-2">
            <span className="text-gray-300 text-sm">{key}</span>
          </div>
          <div className="flex items-center gap-3 pr-4">
            <span className="font-semibold text-white text-sm">
              {statValues[key as keyof typeof statValues]}
            </span>
          </div>
        </div>
      );
    });
  };
  return (
    <div>
      <div>Statistics</div>
      {statistics ? (
        Object.entries(statistics)
          .sort()
          .map(([statName, value]) => (
            <StatRow
              key={statName}
              label={statName}
              value={value.effectiveValue}
              tooltip={<Tooltip statValues={value} />}
              isTrainable={!!canTrain}
              progress={{
                effective: value.effectiveValue,
                max: value.max,
              }}
            />
          ))
      ) : (
        <>TODO: Skeleton</>
      )}
    </div>
  );
};

type TrainBaseStatisticButtonProps = {
  statisticName: string;
  onSuccessTrain: () => void;
};

export const TrainBaseStatisticButton = ({
  statisticName,
  onSuccessTrain,
}: TrainBaseStatisticButtonProps) => {
  const [statAddValue, setStatAddValue] = useState(0);
  return (
    <>
      {statAddValue > 0 ? (
        <Button
          className="h-4 w-4 text-green-400 hover:bg-green-900/50 p-0"
          onClick={() => {
            fetchBackendApi<boolean>({
              url: `characters/train-statistic/${statisticName.toUpperCase()}/${statAddValue}`,
              method: "PATCH",
              notification: { pendingText: `Trying to train ${statisticName}` },
            }).then((response) => {
              if (response?.body.data) {
                setStatAddValue(0);
                onSuccessTrain();
              }
            });
          }}
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      ) : null}
      <Button
        className="h-4 w-16 text-green-400 hover:brightness-105 p-0"
        onClick={() => {
          setStatAddValue((prevState) => prevState + 1);
        }}
      >
        <PlusCircle className="h-4 w-4" /> {statAddValue}
      </Button>
    </>
  );
};

type AdditionalStatisticsProps = {
  statistics?: HeroAdditionalStatistics;
};

export const AdditionalStatistics: FC<AdditionalStatisticsProps> = ({
  statistics,
}) => {
  const Tooltip = ({
    statValues,
  }: {
    statValues: HeroAdditionalStatisticsValues;
  }) => {
    return Object.keys(statValues).map((key) => {
      return (
        <div
          key={key}
          className={
            "w-full flex items-center justify-between py-2.5 border-b border-gray-700/100 last:border-b-0"
          }
        >
          <div className="flex items-center gap-1.5">
            <span className="text-gray-300 text-sm">{key}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white text-sm">
              {statValues[key as keyof typeof statValues]}
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      {statistics ? (
        Object.entries(statistics)
          .sort()
          .map(([statName, value]) => (
            <StatRow
              key={statName}
              label={statName}
              value={value.effectiveValue}
              tooltip={<Tooltip statValues={value} />}
              isTrainable={false}
            />
          ))
      ) : (
        <>TODO: Skeleton</>
      )}
    </div>
  );
};
//TODO: tooltip with advanced statistics display

type BaseDetailsProps = {
  character?: CharacterTypesAlias;
};

export const BaseDetails: FC<BaseDetailsProps> = ({ character }) => {
  const { name, level, health } = character || {};
  const isMercenary = character && isMercenaryCharacter(character);

  const maxHealth =
    character?.stats.additionalStatistics["MAX_HEALTH"].effectiveValue;
  const hpPercentage = character
    ? (character.health / (maxHealth || character.health)) * 100
    : 0;
  const xpPercentage =
    character && !isMercenaryCharacter(character)
      ? (character.health / character.expToLevelUp) * 100
      : 0;

  return (
    <div className="mb-4">
      <div className="aspect-square relative flex items-center justify-center p-2 bg-black/20 rounded-md">
        <CharacterAvatar />
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-xl font-semibold text-yellow-200">{name}</h3>
        <p className="text-md text-gray-400">Level {level}</p>
      </div>
      <div className="space-y-1.5 mt-2">
        <div>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="font-medium text-red-400">HP</span>
            <span className="text-gray-400">
              {health || 1}/{maxHealth}
            </span>{" "}
          </div>
          <Progress value={hpPercentage} className="h-2 [&>*]:bg-red-500" />
        </div>
        {!isMercenary ? (
          <div>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="font-medium text-green-400">XP</span>
              <span className="text-gray-400">
                {character?.experience || 0}/ {character?.expToLevelUp || 100}
              </span>
            </div>
            <Progress value={xpPercentage} className="h-2 [&>*]:bg-green-500" />
          </div>
        ) : null}
      </div>
    </div>
  );
};
