import { FC } from "react";
import { AdditionalStatistics, BaseStatistics } from "../details/statistics";
import { useCharacterManagementContext } from "./character-management-context";
import { isMercenaryCharacter } from "@/api/utils";

type TrainCharacterStatisticsProps = {};

export const TrainCharacterStatistics: FC<
  TrainCharacterStatisticsProps
> = ({}) => {
  const { getCurrentSelectedCharacter, setCurrentCharacterId } =
    useCharacterManagementContext();

  const currentCharacter = getCurrentSelectedCharacter();

  if (!currentCharacter) return <>No character</>;
  return (
    <div>
      <BaseStatistics
        statistics={currentCharacter.stats.statistics}
        {...(!isMercenaryCharacter(currentCharacter)
          ? {
              canTrain: {
                onSuccesTrain: () =>
                  setCurrentCharacterId(currentCharacter.id, true),
              },
            }
          : null)}
      />
      <AdditionalStatistics
        statistics={currentCharacter.stats.additionalStatistics}
      />
    </div>
  );
};
