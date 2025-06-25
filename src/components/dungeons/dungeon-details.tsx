import { FC } from "react";
import { CompletedDungeons } from "./types";
import { Button } from "../ui/button";

type DungeonDetailsProps = {
  increaseCurrentLevel: () => void;
  decreaseCurrentLevel: () => void;
  currentMaxLevel: number;
  data?: CompletedDungeons;
};

export const DungeonDetails: FC<DungeonDetailsProps> = ({
  currentMaxLevel,
  decreaseCurrentLevel,
  increaseCurrentLevel,
  data,
}) => {
  return (
    <div>
      <div>
        <Button onClick={decreaseCurrentLevel}>{"<"}</Button>
      </div>
      <div>
        {data ? (
          <>
            <div>Defeated dungeon. Level: {data.level}</div>
            <div>
              {new Date(data.finished).toLocaleDateString()}
              {new Date(data.finished).toLocaleTimeString()}
            </div>
          </>
        ) : (
          <>
            <div>
              Dungeon not defeated.
              <br /> Level: {currentMaxLevel}
            </div>
          </>
        )}
      </div>
      <div>
        <Button onClick={increaseCurrentLevel}>{">"}</Button>
      </div>
    </div>
  );
};
