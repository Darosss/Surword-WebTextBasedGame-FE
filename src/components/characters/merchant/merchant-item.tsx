import { MerchantItemType } from "@/api/types";
import { DragSourceMonitor, useDrag } from "react-dnd";
import {
  DragBaseCollectedProps,
  DropDragObjectIntoInventory,
  DropResultAsMerchantItem,
} from "../dndTypes";
import { ItemDisplay } from "@/components/items";
import { allowDropToPrefixes } from "../dndHelpers";
import { PossibleDropResultActions } from "../equipment";
import { FC } from "react";

type MerchantItemsProps = {
  itemData: MerchantItemType;
  onItemBuy: (id: string, cost: number) => void;
  currentGold: number;
};

export const MerchantItem: FC<MerchantItemsProps> = ({
  itemData: { item, cost },
  onItemBuy,
  currentGold,
}) => {
  const [{ opacity }, drag] = useDrag<
    DropDragObjectIntoInventory,
    DropResultAsMerchantItem,
    DragBaseCollectedProps
  >(
    () => ({
      type: allowDropToPrefixes.inventory + item.type,
      item: {
        name: item.name,
        id: item.id,
        dropAction: PossibleDropResultActions.BUY_ITEM,
      },
      end(item, monitor) {
        const dropResult = monitor.getDropResult();
        if (
          item &&
          dropResult?.dropAction === PossibleDropResultActions.BUY_ITEM
        ) {
          onItemBuy(item.id, cost);
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [item, cost]
  );

  return (
    <ItemDisplay
      refForWrapper={drag}
      item={item}
      costOptions={{
        canAfford: cost <= currentGold,
        value: cost,
      }}
      opacity={opacity}
    />
  );
};
