import type React from "react";
import { cn } from "@/lib/utils";

import {
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  Skull,
  Swords,
  Sword,
  InfoIcon,
  LucideSwords,
} from "lucide-react";
import { FC } from "react";
import {
  ReportTurnAction,
  ReportTurnActionMoveAttack,
  ReportTurnActionMoveDefend,
} from "@/api/types";

type StylesType = {
  text: string;
  bg: string;
  label: React.ReactNode;
};

const attackStyles: Partial<
  Record<
    | ReportTurnActionMoveAttack["baseValues"]["attackStrength"]["attackStrength"]
    | "DOUBLED_ATTACK",
    StylesType
  >
> = {
  CRITIC: {
    text: "text-yellow-400 font-semibold",
    bg: "bg-yellow-800/80",
    label: <Sparkles className="inline h-3.5 w-3.5" />,
  },
  LETHAL: {
    text: "text-orange-400 font-bold",
    bg: "bg-orange-800/80",
    label: <Skull className="inline h-3.5 w-3.5" />,
  },
  NORMAL: {
    text: "text-white font-bold",
    bg: "bg-black-800/80",
    label: <Swords className="inline h-3.5 w-3.5" />,
  },
  DOUBLED_ATTACK: {
    text: "text-purple-400",
    bg: "bg-purple-800/80",
    label: <LucideSwords className="inline h-3.5 w-3.5" />,
  },
};
const defendStyles: Partial<
  Record<ReportTurnActionMoveDefend["defendType"], StylesType>
> = {
  PAIRED: {
    text: "text-sky-400",
    bg: "bg-sky-800/80",
    label: <ShieldCheck className="inline h-3.5 w-3.5" />,
  },
  DODGED: {
    text: "text-gray-400 italic",
    bg: "text-gray-800/80",
    label: <ShieldOff className="inline h-3.5 w-3.5" />,
  },
  BLOCKED: {
    text: "text-indigo-400 italic",
    bg: "text-indigo-800/80",
    label: <ShieldAlert className="inline h-3.5 w-3.5" />,
  },
  NULL: { text: "", bg: "", label: <></> },
};

type LineWrapperProps = {
  iconContent: React.ReactNode;
  content: React.ReactNode;
  asEnd?: boolean;
};

//TODO: note -> this defenderName + attackerNames should be fixed later? idk

const LineWrapper: FC<LineWrapperProps> = ({ iconContent, content, asEnd }) => {
  return (
    <div
      className={cn("flex-grow flex", asEnd && "border-b border-gray-800/70")}
    >
      <div className="py-2 px-3 text-xs border-b border-gray-800/70 flex-grow last:border-b-0 hover:bg-gray-800/40 transition-colors flex flex-col gap-2">
        <div className="flex ">
          <div className="flex-shrink-0 mr-1 flex items-center">
            {iconContent}
          </div>
          {content}
        </div>
      </div>
    </div>
  );
};

type TurnActionsLineProps = {
  attack: ReportTurnActionMoveAttack;
  defend: ReportTurnActionMoveDefend;
  attackerName: string;
  defenderName: string;
};

const TurnActionsLine: FC<TurnActionsLineProps> = ({
  attack,
  defend,
  attackerName,
  defenderName,
}) => {
  return (
    <>
      <div className="flex-grow flex">
        <AttackItem
          attack={attack}
          defenderName={defenderName}
          attackerName={attackerName}
        />
        {"|"}
        <DefendItem defend={defend} defenderName={defenderName} />

        <ResultItem attack={attack} defend={defend} />
      </div>
    </>
  );
};

type InfoTurnLineProps = {
  content: React.ReactNode;
};
export const InfoTurnLine: FC<InfoTurnLineProps> = ({ content }) => {
  return (
    <LineWrapper
      iconContent={<InfoIcon className="w-5 h-5" />}
      content={
        <span className="text-gray-500 ml-0.5 mr-1.5 flex items-center">
          {content}
        </span>
      }
    />
  );
};

type CombatTurnActionProps = {
  action: ReportTurnAction;
  lastTurn: boolean;
  lastActionInTurn: boolean;
  charsMap: Map<string, string>;
};
export const CombatTurnAction: FC<CombatTurnActionProps> = ({
  action,
  lastTurn,
  lastActionInTurn,
  charsMap,
}) => {
  const { basicAttack, doubledAttack } = action;

  const { attack: basicA, defend: basicD } = basicAttack;

  const basicParryDefend = basicD.parryAttack?.basicAttack.defend;
  const dbleParryDefend = doubledAttack?.defend.parryAttack?.basicAttack.defend;

  // if basic attack killed defender
  const defenderDefeated = basicD.health === 0 && charsMap.get(basicD.id);
  //if atacker got parried by defender and killed either by his basic or doubled attack
  const attackerDefeated =
    basicParryDefend?.health === 0
      ? charsMap.get(basicParryDefend.id)
      : dbleParryDefend?.health === 0
      ? charsMap.get(dbleParryDefend?.id)
      : "";
  const actionIcon = <Sword className="w-5 h-5" />;

  return (
    <>
      <LineWrapper
        iconContent={actionIcon}
        content={
          <div className="flex flex-col">
            {doubledAttack && (
              <span className="text-orange-500 ml-0.5 mr-1.5 flex items-center">
                <Swords className="inline h-3.5 w-3.5" /> 2x
              </span>
            )}

            <TurnActionsLine
              attack={basicA}
              defend={basicD}
              defenderName={charsMap.get(basicD.id) || basicD.id}
              attackerName={charsMap.get(basicA.id) || basicA.id}
            />

            {basicD.parryAttack ? (
              <ParryItem
                attack={basicD.parryAttack.basicAttack.attack}
                defend={basicD.parryAttack.basicAttack.defend}
                defenderName={
                  charsMap.get(basicD.parryAttack.basicAttack.defend.id) ||
                  basicD.parryAttack.basicAttack.defend.id
                }
                attackerName={
                  charsMap.get(basicD.parryAttack.basicAttack.attack.id) ||
                  basicD.parryAttack.basicAttack.attack.id
                }
              />
            ) : null}

            {doubledAttack ? (
              <div className="flex-grow flex">
                <TurnActionsLine
                  attack={doubledAttack.attack}
                  defend={doubledAttack.defend}
                  defenderName={
                    charsMap.get(doubledAttack.defend.id) ||
                    doubledAttack.defend.id
                  }
                  attackerName={
                    charsMap.get(doubledAttack.attack.id) ||
                    doubledAttack.attack.id
                  }
                />
              </div>
            ) : null}
          </div>
        }
        asEnd={lastActionInTurn}
      />
      {defenderDefeated && (
        <InfoTurnLine content={<> {defenderDefeated} has been defeated! </>} />
      )}
      {attackerDefeated && (
        <InfoTurnLine content={<> {attackerDefeated} has been defeated! </>} />
      )}
      {lastTurn && <InfoTurnLine content={<> Battle end </>} />}
    </>
  );
};

type AttackItemProps = {
  attack: ReportTurnActionMoveAttack;
  attackerName: string;
  defenderName: string;
};
const AttackItem: FC<AttackItemProps> = ({
  attack,
  attackerName,
  defenderName,
}) => {
  const currentAttStyles =
    attackStyles[attack.baseValues.attackStrength.attackStrength];

  return (
    <>
      <span className="font-semibold text-blue-500 mr-1">{attackerName} </span>
      attacks{" "}
      <span className={cn(currentAttStyles?.text)}>
        ({currentAttStyles?.label}
        {attack.baseValues.value})
      </span>
      <span className="font-semibold text-red-500 mx-1">{defenderName} </span>
    </>
  );
};

type DefendItemProps = {
  defend: ReportTurnActionMoveDefend;
  defenderName: string;
};
const DefendItem: FC<DefendItemProps> = ({ defend, defenderName }) => {
  const basicDStyles = defendStyles[defend.defendType]!;
  return (
    <>
      <span className="font-semibold text-red-500 mx-1">{defenderName} </span>(
      {defend.health} HP)
      <span className={cn("ml-1", basicDStyles.text)}>
        {basicDStyles?.label}
        {defend.defendType !== "NULL" ? defend.defendType.toLowerCase() : ""}
      </span>
    </>
  );
};

type ResultItemProps = {
  attack: ReportTurnActionMoveAttack;
  defend: ReportTurnActionMoveDefend;
};
const ResultItem: FC<ResultItemProps> = ({ attack, defend }) => {
  const basicAStrength = attack.baseValues.attackStrength.attackStrength;

  const basicAStyles = attackStyles[basicAStrength]!;
  if (!defend.receivedDamage) return null;
  return (
    <>
      <span className="mr-1"> {basicAStyles.label} </span>
      {basicAStrength !== "NORMAL" ? basicAStrength.toLowerCase() : ""} hit for
      <span className="text-danger mx-1">{defend.receivedDamage}</span> health
    </>
  );
};
type ParryItemProps = {
  attack: ReportTurnActionMoveAttack;
  defend: ReportTurnActionMoveDefend;
  attackerName: string;
  defenderName: string;
};
const ParryItem: FC<ParryItemProps> = ({
  attack,
  defend,
  attackerName,
  defenderName,
}) => {
  return (
    <>
      <span
        className={cn(
          `ml-0.5 mr-1.5 flex items-center`,
          defendStyles["PAIRED"]?.text
        )}
      >
        {defendStyles["PAIRED"]?.label} parry
      </span>
      <div className="flex-grow flex">
        <TurnActionsLine
          attack={attack}
          defend={defend}
          defenderName={defenderName}
          attackerName={attackerName}
        />
      </div>{" "}
    </>
  );
};
