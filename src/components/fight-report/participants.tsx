import { Dispatch, FC, SetStateAction, useState } from "react";
import { CharacterTypesAlias, NpcEnemy } from "@/api/types";
import { CharacterPreview, EnemyPreview } from "../characters";
import styles from "./fight-report.module.scss";
import { Button } from "../ui/button";

type ParticipantsProps = {
  characters: CharacterTypesAlias[];
  enemies: NpcEnemy[];
};

export const Participants: FC<ParticipantsProps> = ({
  characters,
  enemies,
}) => {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);

  const handleOnLeftHeroChange = (
    setState: Dispatch<SetStateAction<number>>
  ) => {
    return setState((prevState) => Math.max(prevState - 1, 0));
  };
  const handleOnRightHeroChange = (
    isCharacter: boolean,
    setState: Dispatch<SetStateAction<number>>
  ) => {
    setState((prevState) => {
      const newValue = prevState + 1;
      if (isCharacter && newValue >= characters.length)
        return characters.length - 1;
      else if (!isCharacter && newValue >= enemies.length)
        return enemies.length - 1;

      return newValue;
    });
  };

  const currentCharacter = characters.at(currentCharacterIndex);

  const currentEnemy = enemies.at(currentEnemyIndex);

  return (
    <div className={styles.participantsDetails}>
      <div>
        {currentCharacter ? (
          <>
            {characters.length > 1 ? (
              <div className={styles.navigationHeroPreview}>
                <Button
                  onClick={() =>
                    handleOnLeftHeroChange(setCurrentCharacterIndex)
                  }
                >
                  {"<"}
                </Button>
                <Button
                  onClick={() =>
                    handleOnRightHeroChange(true, setCurrentCharacterIndex)
                  }
                >
                  {">"}
                </Button>
              </div>
            ) : null}

            <CharacterPreview character={currentCharacter} />
          </>
        ) : null}
      </div>
      <div>
        {currentEnemy ? (
          <>
            <EnemyPreview enemy={currentEnemy} />
            {enemies.length > 1 ? (
              <div className={styles.navigationHeroPreview}>
                <Button
                  onClick={() => handleOnLeftHeroChange(setCurrentEnemyIndex)}
                >
                  {"<"}
                </Button>
                <Button
                  onClick={() =>
                    handleOnRightHeroChange(false, setCurrentEnemyIndex)
                  }
                >
                  {">"}
                </Button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};
