import { ReportTurn } from "@/api/types";
import { FC } from "react";
import { CombatTurnAction, InfoTurnLine } from "./combat-log-items";

type CombatTurnActionsProps = {
  entry: ReportTurn;
};
export const CombatTurnActions: FC<CombatTurnActionsProps> = ({ entry }) => {
  return entry.actions.map((action, index) => {
    const lastActionInTurn = index === entry.actions.length - 1;
    return (
      <>
        {index === 0 ? (
          <InfoTurnLine
            content={
              <span className="text-gray-500 ml-0.5 mr-1.5 flex items-center">
                Turn {entry.turnNumber + 1} started
              </span>
            }
          />
        ) : null}

        <CombatTurnAction
          key={entry.turnNumber + index}
          action={action}
          lastActionInTurn={lastActionInTurn}
          lastTurn={entry.endOfFight && lastActionInTurn}
        />
      </>
    );
  });
};
