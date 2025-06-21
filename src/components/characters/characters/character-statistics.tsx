import { FC } from "react";
import {
  AdditionalStatistics,
  BaseDetails,
  BaseStatistics,
} from "../details/statistics";
import { useCharacterManagementContext } from "./character-management-context";

type CharacterStatisticsProps = {};

export const CharacterStatistics: FC<CharacterStatisticsProps> = ({}) => {
  const {
    api: { data },
  } = useCharacterManagementContext();

  return (
    <div>
      <div>
        <BaseDetails character={data} />
      </div>
      <BaseStatistics statistics={data.stats.statistics} />
      <AdditionalStatistics statistics={data.stats.additionalStatistics} />
    </div>
  );
};
