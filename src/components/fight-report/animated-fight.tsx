import { ReportTurn, Character, FightReportType, NpcEnemy } from "@/api/types";
import { FC, useEffect, useRef, useState } from "react";
import { CombatTurnActions } from "./combat-turn-actions";
import { motion } from "framer-motion";
import { Users, Shield } from "lucide-react";
import { PartyCarousel } from "./party-carousel";
import { ResultsAndRewards } from "./results-and-rewards";

type AnimatedFightProps = { report: FightReportType };

enum AnimatedSteps {
  FIGHT_START,
  PARTICIPANTS_TEAM_1_SHOW,
  PARTICIPANTS_TEAM_2_SHOW,
  FIGHT_TURNS,
  FIGHT_ENDED,
  RESULTS,
}

export const AnimatedFight: FC<AnimatedFightProps> = ({ report }) => {
  const {
    characters,
    enemies,
    turnsReports,
    gainedExperience,
    gainedGold,
    status,
    loot,
  } = report;
  const [step, setStep] = useState(AnimatedSteps.FIGHT_START);
  const [visibleTurns, setVisibleTurns] = useState<ReportTurn[]>([]);
  const turnsWrapper = useRef<HTMLDivElement>(null);
  const hasRunAnimiation = useRef(false);
  const [animatedPlayerChars, setAnimatedPlayerChars] = useState<
    Map<string, Character>
  >(
    new Map(
      characters.map((playerChar) => {
        return [
          playerChar.id,
          {
            ...playerChar,
            health:
              playerChar.stats.additionalStatistics["MAX_HEALTH"]
                .effectiveValue || playerChar.health,
          },
        ];
      })
    )
  );
  const [animatedEnemyChars, setAnimatedEnemyChars] = useState<
    Map<string, NpcEnemy>
  >(
    new Map(
      enemies.map((enemyChar) => {
        return [
          enemyChar.id,
          {
            ...enemyChar,
            health:
              enemyChar.stats.additionalStatistics["MAX_HEALTH"]
                .effectiveValue || enemyChar.health,
          },
        ];
      })
    )
  );

  const [charsMap] = useState(
    new Map([...characters, ...enemies].map((char) => [char.id, char.name]))
  );
  const updatePartyCharacters = (id: string, receivedDamage: number) => {
    if (animatedPlayerChars.has(id)) {
      setAnimatedPlayerChars((prevState) => {
        const character = prevState.get(id)!;
        const updatedCharacter = {
          ...character,
          health: character.health - receivedDamage,
        };
        const newMap = new Map(prevState);
        newMap.set(id, updatedCharacter);

        return newMap;
      });
    } else {
      setAnimatedEnemyChars((prevState) => {
        const character = prevState.get(id)!;
        const updatedCharacter = {
          ...character,
          health: character.health - receivedDamage,
        };
        const newMap = new Map(prevState);
        newMap.set(id, updatedCharacter);

        return newMap;
      });
    }
  };

  const handleChangeAnimationStep = async (
    delay: number,
    step: AnimatedSteps
  ) => {
    setStep(step);
    await new Promise((res) => setTimeout(res, delay));
  };

  const animationStart = async () => {
    handleChangeAnimationStep(100, AnimatedSteps.FIGHT_START);
    if (hasRunAnimiation.current) return;
    hasRunAnimiation.current = true;
    await handleChangeAnimationStep(
      1000,
      AnimatedSteps.PARTICIPANTS_TEAM_1_SHOW
    );
    await handleChangeAnimationStep(
      1000,
      AnimatedSteps.PARTICIPANTS_TEAM_1_SHOW
    );
    await handleChangeAnimationStep(1000, AnimatedSteps.FIGHT_TURNS);
    for (let turnI = 0; turnI < turnsReports.length; turnI++) {
      //This line for stopping the animation for now
      if (!hasRunAnimiation.current) break;

      const currentTurn = turnsReports[turnI];

      for (let actionI = 0; actionI < currentTurn.actions.length; actionI++) {
        //This line for stopping the animation for now
        if (!hasRunAnimiation.current) break;
        if (!currentTurn.actions.length) continue;
        await new Promise((res) => setTimeout(res, 1000));
        const currentAction = currentTurn.actions[actionI];

        const defend = currentAction.basicAttack.defend;
        const parry =
          currentAction.basicAttack.defend.parryAttack?.basicAttack.defend;
        const doubledAttackDefend = currentAction.doubledAttack?.defend;
        const doubledAttackParry =
          currentAction.doubledAttack?.defend.parryAttack?.basicAttack.defend;
        const keyId = defend.id;

        updatePartyCharacters(keyId, defend.receivedDamage);
        parry && updatePartyCharacters(parry.id, parry.receivedDamage);
        doubledAttackDefend &&
          updatePartyCharacters(
            doubledAttackDefend.id,
            doubledAttackDefend.receivedDamage
          );
        doubledAttackParry &&
          updatePartyCharacters(
            doubledAttackParry.id,
            doubledAttackParry.receivedDamage
          );

        setVisibleTurns((prev) => {
          const prevState = [...prev];
          const existingTurnIndex = prevState.findIndex(
            (t) => t.turnNumber === currentTurn.turnNumber
          );

          if (existingTurnIndex === -1) {
            return [...prevState, { ...currentTurn, actions: [currentAction] }];
          } else {
            const existingTurn = prevState[existingTurnIndex];
            const updatedActions = [...existingTurn.actions, currentAction];
            const updatedTurn = { ...existingTurn, actions: updatedActions };
            prevState[existingTurnIndex] = updatedTurn;
            return prevState;
          }
        });
      }
    }

    await handleChangeAnimationStep(1000, AnimatedSteps.FIGHT_ENDED);
    await handleChangeAnimationStep(1500, AnimatedSteps.RESULTS);
  };
  useEffect(() => {
    animationStart();

    return () => {
      hasRunAnimiation.current = false;
    };
  }, []);

  useEffect(() => {
    if (turnsWrapper.current) {
      turnsWrapper.current.scrollTo({
        top: turnsWrapper.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleTurns]);

  return (
    <div className="bg-gray-800/90 p-0 relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: step === AnimatedSteps.FIGHT_START ? 1 : 0,
          transition: { duration: 0.5 },
        }}
        className="inset-0 w-full absolute z-50 text-9xl flex items-center justify-center"
      >
        FIGHT!
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: step === AnimatedSteps.FIGHT_ENDED ? 1 : 0,
          transition: { duration: 0.2 },
        }}
        className="inset-0 w-full absolute z-50 text-9xl flex items-center justify-center"
      >
        Fight finished!
      </motion.div>
      {step !== AnimatedSteps.RESULTS ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: step === AnimatedSteps.FIGHT_START ? 0 : 1,
              y: 0,
              transition: { duration: 0.5 },
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: step >= AnimatedSteps.PARTICIPANTS_TEAM_1_SHOW ? 1 : 0,
                transition: { duration: 0.5 },
              }}
              className="w-full"
            >
              <PartyCarousel
                participants={animatedPlayerChars}
                partyName="Player Party"
                icon={Users}
                iconColor="text-blue-400"
                team={1}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: step >= AnimatedSteps.PARTICIPANTS_TEAM_2_SHOW ? 1 : 0,
                transition: { duration: 0.5 },
              }}
              className="w-full"
            >
              <PartyCarousel
                participants={animatedEnemyChars}
                partyName="Enemy Forces"
                icon={Shield}
                iconColor="text-red-400"
                team={2}
              />
            </motion.div>
          </motion.div>
          <div
            className="overflow-auto border-t border-gray-700/50 h-[500px] sm:h-[600px] "
            ref={turnsWrapper}
          >
            {turnsReports.length > 0 ? (
              visibleTurns.map((entry, index) => (
                <CombatTurnActions
                  key={"turn_" + entry.turnNumber + "_" + index}
                  turnNumber={entry.turnNumber}
                  endOfFight={entry.endOfFight}
                  actions={entry.actions}
                  charsMap={charsMap}
                />
              ))
            ) : (
              <p className="p-4 text-gray-500 text-center">
                No combat actions recorded.
              </p>
            )}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.5 },
          }}
          className="bg-gray-800/20 p-4 text-sm border-t border-gray-700/50"
        >
          <ResultsAndRewards
            gainedExperience={gainedExperience}
            gainedGold={gainedGold}
            status={status}
            loot={loot}
          />
        </motion.div>
      )}
    </div>
  );
};
