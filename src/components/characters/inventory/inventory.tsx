"use client";

import dndStyles from "../dnd.module.scss";
import { InventoryItems } from "./inventory-items";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { ItemType } from "@/api/enums";
import { allowDropToPrefixes } from "../dndHelpers";
import { useInventoryControlContext } from "./inventory-control-context";
import {
  DropDragObjectIntoInventory,
  InventoryDropResult,
  UseDropBaseCollectedProps,
} from "../dndTypes";
import { FC } from "react";
import { ItemsHeaderFilter } from "@/components/items/items-header-filter";
import { ItemsSidebarFilter } from "@/components/items/items-sidebar-filter";
import { useInventoryManagementContext } from "./inventory-management-context";

export const Inventory: FC = ({}) => {
  const {
    api: { data: inventoryData },
  } = useInventoryManagementContext();
  const [{ canDrop, isOver }, drop] = useDrop<
    DropDragObjectIntoInventory,
    InventoryDropResult,
    UseDropBaseCollectedProps
  >(
    () => ({
      accept: Object.values(ItemType).map(
        (val) => allowDropToPrefixes.inventory + val
      ),
      drop: (item) => {
        return {
          dropAction: item.dropAction,
        };
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    ["any"]
  );
  const { filter, setFilter, sort, setSort } = useInventoryControlContext();

  const isActive = canDrop && isOver;
  return (
    <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-yellow-300 border-b border-gray-600 pb-3 mb-4">
        Inventory
      </h2>

      <ItemsHeaderFilter setFilter={setFilter} sort={sort} setSort={setSort} />
      <ItemsSidebarFilter filter={filter} setFilter={setFilter} />
      <InventoryItems
        items={inventoryData.items}
        dropRef={drop}
        tooltipId="inventory-item-tooltip"
        className={` ${
          isActive ? dndStyles.active : canDrop ? dndStyles.canDrop : ""
        }`}
      />
    </div>
  );
};
