import { ReportTurn } from "@/api/types";
import { FC } from "react";
import { CombatTurnAction, InfoTurnLine } from "./combat-log-items";
import { motion } from "framer-motion";

type CombatTurnActionsProps = {
  actions: ReportTurn["actions"];
  charsMap: Map<string, string>;
  turnNumber: ReportTurn["turnNumber"];
  endOfFight: ReportTurn["endOfFight"];
};
export const CombatTurnActions: FC<CombatTurnActionsProps> = ({
  actions,
  turnNumber,
  endOfFight,
  charsMap,
}) => {
  return actions.map((action, index) => {
    const lastActionInTurn = index === actions.length - 1;
    return (
      <motion.span
        key={turnNumber + "_" + index}
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 40,
          transition: {
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
      >
        {index === 0 ? (
          <InfoTurnLine
            content={
              <span className="text-gray-500 ml-0.5 mr-1.5 flex items-center">
                Turn {turnNumber + 1} started
              </span>
            }
          />
        ) : null}

        <CombatTurnAction
          action={action}
          charsMap={charsMap}
          lastActionInTurn={lastActionInTurn}
          lastTurn={endOfFight && lastActionInTurn}
        />
      </motion.span>
    );
  });
};
