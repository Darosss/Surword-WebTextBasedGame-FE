import {
  InventoryItems as InventoryItemsType,
  EquipResponseType,
  InventoryItemType,
} from "@/api/types";
import { FC, Ref, useMemo, useState } from "react";
import styles from "./inventory-items.module.scss";
import { CharacterEquipmentFields } from "@/api/enums";
import {
  useCharacterManagementContext,
  useMerchantContext,
} from "@/components/characters";
import { InventoryItem } from "./inventory-item";
import { useInventoryControlContext } from "./inventory-control-context";
import { fetchBackendApi } from "@/api/fetch";
import {
  ItemTooltipContentWrapper,
  filterItemsEntries,
  getSortedItems,
} from "@/components/items";
import { useAuthContext } from "@/components/auth";
import { useInventoryManagementContext } from ".";

type InventoryItemsProps = {
  items?: InventoryItemsType;
  tooltipId: string;
  //TODO: move this to conetxt probably;
  dropRef: Ref<HTMLDivElement>;
  className?: string;
};

export const InventoryItems: FC<InventoryItemsProps> = ({
  items,
  tooltipId,
  dropRef,
  className,
}) => {
  const { filter, sort } = useInventoryControlContext();
  const { fetchData: fetchCharacterData } = useCharacterManagementContext();
  const { fetchData: fetchInventoryData } = useInventoryManagementContext();

  const {
    apiMerchant: { fetchData: fetchMerchantData },
  } = useMerchantContext();
  const [currentItem, setCurrentItem] = useState<InventoryItemType | null>(
    null
  );

  const {
    apiUser: { fetchData: fetchUserData },
  } = useAuthContext();

  const itemsToRender = useMemo(
    () =>
      items ? getSortedItems(filterItemsEntries(items, filter), sort) : [],
    [items, filter, sort]
  );

  const handleOnItemConusme = (itemId: string) => {
    fetchBackendApi<boolean>({
      url: `characters/use-consumable/${itemId}`,
      method: "POST",
      notification: { pendingText: "Trying to use consumable item...." },
    }).then(() => {
      fetchCharacterData();
      fetchInventoryData();
      fetchUserData();
    });
  };

  const handleOnItemEquip = (
    characterId: string,
    itemId: string,
    slot: CharacterEquipmentFields
  ) => {
    fetchBackendApi<EquipResponseType>({
      url: `characters/equip/${characterId}/${itemId}/${slot}`,
      method: "POST",
      notification: { pendingText: "Trying to wear item..." },
    }).then(() => {
      fetchInventoryData();
      fetchCharacterData({ customUrl: `characters/${characterId}` });
    });
  };

  const handleOnMercenaryWear = (characterId: string, itemId: string) => {
    fetchBackendApi<EquipResponseType>({
      url: `characters/equip-mercenary/${characterId}/${itemId}`,
      method: "POST",
      notification: { pendingText: "Trying to equip mercenary..." },
    }).then(() => {
      fetchInventoryData();
      fetchCharacterData({ customUrl: `characters/${characterId}` });
    });
  };

  const handleOnSellItem = (id: string) => {
    fetchBackendApi({
      url: `merchants/sell-item/${id}`,
      method: "POST",
      notification: { pendingText: "Trying to sell item" },
    }).then((response) => {
      if (response?.body.data) {
        fetchInventoryData();
        fetchUserData();
        fetchMerchantData();
      }
    });
  };
  return (
    <div
      className={`${styles.itemsWrapper} ${className ? className : ""}`}
      ref={dropRef}
    >
      <ItemTooltipContentWrapper
        customClassName={styles.inventoryTooltip}
        item={currentItem}
        tooltipId={tooltipId}
      />
      {itemsToRender.map((val) => (
        <div key={val[0]} className={styles.oneItemWrapper}>
          <InventoryItem
            key={val[0]}
            inventoryItem={val}
            tooltipId={tooltipId}
            onHover={(item) => setCurrentItem(item)}
            onItemEquip={(characterId, itemId, slot) =>
              handleOnItemEquip(characterId, itemId, slot)
            }
            onItemConsume={(itemId) => handleOnItemConusme(itemId)}
            onMercenaryWear={(characterId, itemId) =>
              handleOnMercenaryWear(characterId, itemId)
            }
            onItemSell={handleOnSellItem}
          />
        </div>
      ))}
    </div>
  );
};
