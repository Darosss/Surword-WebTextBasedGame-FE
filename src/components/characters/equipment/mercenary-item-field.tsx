import { ItemType } from "@/api/enums";
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";
import dndStyles from "../dnd.module.scss";
import styles from "./equipment.module.scss";
import {
  InventoryItemType,
  ItemMercenary,
  UnEquipResponseType,
} from "@/api/types";
import { ItemDisplay } from "@/components/items";
import {
  DragBaseCollectedProps,
  DropDragObjectIntoInventory,
  DropResultAsMercenaryItem,
  MercenaryEquipmentFieldDropResult,
  UseDropBaseCollectedProps,
} from "../dndTypes";
import { useCharacterManagementContext } from "@/components/characters";
import {
  useInventoryControlContext,
  useInventoryManagementContext,
} from "../inventory";
import Image from "next/image";
import { fetchBackendApi } from "@/api/fetch";
import { allowDropToPrefixes } from "../dndHelpers";
import { PossibleDropResultActions } from "./enums";
import { FC } from "react";

export type MercenaryItemFieldProps = {
  mercenaryItem?: ItemMercenary;
  onHover: (item: InventoryItemType) => void;
  tooltipId: string;
  itemDisplayOpacity?: number;
  itemDisplayRefWrapper?: React.Ref<HTMLDivElement> | undefined;
};

export const MercenaryItemField: FC<MercenaryItemFieldProps> = ({
  mercenaryItem,
  onHover,
  tooltipId,
  itemDisplayOpacity,
  itemDisplayRefWrapper,
}) => {
  return (
    <div className={styles.emptyEquipmentSlot}>
      <div className={styles.background}></div>
      {mercenaryItem ? (
        <ItemDisplay
          refForWrapper={itemDisplayRefWrapper}
          item={mercenaryItem}
          onHover={(item) => onHover(item)}
          tooltipId={tooltipId}
          opacity={itemDisplayOpacity}
        />
      ) : (
        <Image
          alt={ItemType.MERCENARY}
          src={`/images/equipment/${ItemType.MERCENARY.toString().toLowerCase()}.png`}
          sizes="(max-width: 768px) 15vw, (max-width: 1200px) 25vw, 33vw"
          fill
        />
      )}
    </div>
  );
};
