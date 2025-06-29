import { ItemType } from "@/api/enums";
import Image from "next/image";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { useCharacterManagementContext } from "./character-management-context";
import dndStyles from "../dnd.module.scss";
import { allowDropToPrefixes } from "../dndHelpers";
import {
  BaseDropResultsFromInventory,
  UseDropBaseCollectedProps,
} from "../dndTypes";
import { PossibleDropResultActions } from "../equipment";
import { FC } from "react";
import { cn } from "@/lib/utils";

export const CharacterAvatar: FC = () => {
  const { getCurrentSelectedCharacter } = useCharacterManagementContext();

  const currentCharacter = getCurrentSelectedCharacter();
  const [{ canDrop, isOver }, drop] = useDrop<
    unknown,
    BaseDropResultsFromInventory,
    UseDropBaseCollectedProps
  >(
    () => ({
      accept: allowDropToPrefixes.equipmentAndMerchant + ItemType.CONSUMABLE,
      drop: () => ({
        dropAction: PossibleDropResultActions.CONSUME,
        characterId: currentCharacter?.id,
      }),
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    ["any"]
  );
  const isActive = canDrop && isOver;
  return (
    <Image
      src="/images/hero-placeholder.png"
      alt="Character Avatar"
      fill
      ref={drop}
      className={cn(
        "max-w-full h-auto rounded-md object-contain",
        isActive ? dndStyles.active : canDrop ? dndStyles.canDrop : ""
      )}
    />
  );
};
