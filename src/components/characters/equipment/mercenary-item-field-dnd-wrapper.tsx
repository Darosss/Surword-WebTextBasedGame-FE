import { FC } from "react";
import dndStyles from "../dnd.module.scss";
import { ItemType } from "@/api/enums";
import { fetchBackendApi } from "@/api/fetch";
import { UnEquipResponseType } from "@/api/types";
import {
  useDrop,
  DropTargetMonitor,
  useDrag,
  DragSourceMonitor,
} from "react-dnd";
import { PossibleDropResultActions } from ".";
import { useCharacterManagementContext } from "..";
import { allowDropToPrefixes } from "../dndHelpers";
import {
  MercenaryEquipmentFieldDropResult,
  UseDropBaseCollectedProps,
  DropDragObjectIntoInventory,
  DropResultAsMercenaryItem,
  DragBaseCollectedProps,
} from "../dndTypes";
import {
  useInventoryManagementContext,
  useInventoryControlContext,
} from "../inventory";
import {
  MercenaryItemField,
  MercenaryItemFieldProps,
} from "./mercenary-item-field";

type MercenaryItemFielDnDWrapperProps = {
  characterId: string;
};

export const MercenaryItemFielDnDWrapper: FC<
  MercenaryItemFielDnDWrapperProps &
    Omit<
      MercenaryItemFieldProps,
      "itemDisplayRefWrapper" | "itemDisplayOpacity"
    >
> = ({ characterId, ...restProps }) => {
  const { mercenaryItem } = restProps;
  const { fetchData: fetchCharacterData } = useCharacterManagementContext();
  const { fetchData: fetchInventoryData } = useInventoryManagementContext();

  const { setFilter } = useInventoryControlContext();
  const [{ canDrop, isOver }, drop] = useDrop<
    unknown,
    MercenaryEquipmentFieldDropResult,
    UseDropBaseCollectedProps
  >(
    () => ({
      accept: allowDropToPrefixes.equipmentAndMerchant + ItemType.MERCENARY,
      drop: () => ({
        dropAction: PossibleDropResultActions.EQUIP_MERCENARY,
        characterId,
      }),
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [characterId]
  );

  const [{ opacity }, drag] = useDrag<
    DropDragObjectIntoInventory,
    DropResultAsMercenaryItem,
    DragBaseCollectedProps
  >(
    () => ({
      type: allowDropToPrefixes.inventory + mercenaryItem?.type,
      item: {
        name: mercenaryItem?.name || "No mercenary",
        id: mercenaryItem?.id || "No id mercenary",
        dropAction: PossibleDropResultActions.UN_EQUIP_MERCENARY,
      },
      end(item, monitor) {
        const dropResult = monitor.getDropResult();
        if (
          item &&
          dropResult?.dropAction ===
            PossibleDropResultActions.UN_EQUIP_MERCENARY
        ) {
          onUnEquipMercenary();
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [mercenaryItem]
  );
  const onUnEquipMercenary = () => {
    fetchBackendApi<UnEquipResponseType>({
      url: `characters/un-equip-mercenary/${characterId}`,
      method: "POST",
      notification: { pendingText: "Trying to un equip mercenary..." },
    }).then(() => {
      fetchInventoryData();
      fetchCharacterData({ customUrl: `characters/${characterId}` });
    });
  };

  const isActive = canDrop && isOver;
  return (
    <div
      ref={drop}
      className={`w-full h-full
        ${isActive ? dndStyles.active : canDrop ? dndStyles.canDrop : ""}`}
      style={{ opacity }}
      onClick={() =>
        setFilter((prevState) => ({
          ...prevState,
          showType: [ItemType.MERCENARY],
        }))
      }
    >
      <MercenaryItemField {...restProps} itemDisplayRefWrapper={drag} />
    </div>
  );
};
