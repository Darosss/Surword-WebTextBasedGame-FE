import { FC } from "react";
import { CharacterEquipmentFields } from "@/api/enums";
import { InventoryItemType } from "@/api/types";
import { ItemDisplay } from "@/components/items";
import { useDrag, DragSourceMonitor } from "react-dnd";
import {
  DragBaseCollectedProps,
  DragObjectInventoryItem,
  DropResultAsInventoryItem,
} from "../dndTypes";
import { allowDropToPrefixes } from "../dndHelpers";
import { PossibleDropResultActions } from "../equipment";

type InventoryItemProps = {
  inventoryItem: InventoryItemType;
  onItemEquip: (
    characterId: string,
    itemId: string,
    slotName: CharacterEquipmentFields
  ) => void;
  onItemConsume: (itemId: string) => void;
  onMercenaryWear: (characterId: string, itemId: string) => void;
  onItemSell: (itemId: string) => void;
};

export const InventoryItem: FC<InventoryItemProps> = ({
  inventoryItem: item,
  onItemEquip,
  onItemConsume,
  onMercenaryWear,
  onItemSell,
}) => {
  const [{ opacity }, drag] = useDrag<
    DragObjectInventoryItem,
    DropResultAsInventoryItem,
    DragBaseCollectedProps
  >(
    () => ({
      type: allowDropToPrefixes.equipmentAndMerchant + item.type,
      item: { name: item.name, id: item.id, type: item.type },
      end(item, monitor) {
        const dropResult = monitor.getDropResult();
        if (!dropResult || !item) return;

        switch (dropResult.dropAction) {
          case PossibleDropResultActions.CONSUME:
            onItemConsume(item.id);
            break;
          case PossibleDropResultActions.SELL_ITEM:
            onItemSell(item.id);
            break;
          case PossibleDropResultActions.EQUIP_ITEM:
            onItemEquip(dropResult.characterId, item.id, dropResult.name);
            break;
          case PossibleDropResultActions.EQUIP_MERCENARY:
            onMercenaryWear(dropResult.characterId, item.id);
            break;
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [item]
  );
  return <ItemDisplay refForWrapper={drag} item={item} opacity={opacity} />;
};
