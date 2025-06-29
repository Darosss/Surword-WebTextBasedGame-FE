import { FC } from "react";
import {
  AdditionalStatistics,
  BaseDetails,
  BaseStatistics,
} from "../details/statistics";
import { useCharacterManagementContext } from "./character-management-context";

type CharacterStatisticsProps = {};

export const CharacterStatistics: FC<CharacterStatisticsProps> = ({}) => {
  const { getCurrentSelectedCharacter } = useCharacterManagementContext();

  const currentCharacter = getCurrentSelectedCharacter();
  return (
    <div>
      <div>
        <BaseDetails character={currentCharacter || undefined} />
      </div>
      <BaseStatistics statistics={currentCharacter?.stats.statistics} />
      <AdditionalStatistics
        statistics={currentCharacter?.stats.additionalStatistics}
      />
    </div>
  );
};
