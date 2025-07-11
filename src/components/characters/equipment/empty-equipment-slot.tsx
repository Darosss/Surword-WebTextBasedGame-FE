import { CharacterEquipmentFields } from "@/api/enums";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { equipmentFieldToItemType } from "./slot-mapping";
import dndStyles from "../dnd.module.scss";
import Image from "next/image";
import { allowDropToPrefixes } from "../dndHelpers";
import {
  BaseEquipmentFieldDropResult,
  UseDropBaseCollectedProps,
} from "../dndTypes";
import { PossibleDropResultActions } from "./enums";
import { FC } from "react";

type EmptyEquipmentSlotProps = {
  equipmentField: CharacterEquipmentFields;
  characterId?: string;
  onClickEquipmentSlot?: (slotName: CharacterEquipmentFields) => void;
};

export const EmptyEquipmentSlot: FC<EmptyEquipmentSlotProps> = ({
  equipmentField,
  characterId,
  onClickEquipmentSlot,
}) => {
  const [{ canDrop, isOver }, drop] = useDrop<
    unknown,
    BaseEquipmentFieldDropResult | null,
    UseDropBaseCollectedProps
  >(
    () => ({
      accept: equipmentFieldToItemType[equipmentField].map(
        (val) => allowDropToPrefixes.equipmentAndMerchant + val
      ),
      drop: () =>
        characterId
          ? {
              dropAction: PossibleDropResultActions.EQUIP_ITEM,
              characterId,
              name: equipmentField,
            }
          : null,
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [characterId, equipmentField]
  );
  const isActive = canDrop && isOver;
  return drop(
    <div
      className={`w-full h-full
        ${isActive ? dndStyles.active : canDrop ? dndStyles.canDrop : ""}`}
      onClick={() =>
        onClickEquipmentSlot ? onClickEquipmentSlot(equipmentField) : null
      }
    >
      <Image
        alt={equipmentField}
        src={`/images/equipment/${
          !equipmentField.includes("RING")
            ? equipmentField.toLowerCase()
            : "ring"
        }.png`}
        className="bg-white/10"
        sizes="(max-width: 768px) 15vw, (max-width: 1200px) 25vw, 33vw"
        fill
      />
    </div>
  );
};
