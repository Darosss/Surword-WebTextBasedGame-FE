import {
  InventoryItems as InventoryItemsType,
  EquipResponseType,
  UseConsumableItem,
  SellItemResponseType,
} from "@/api/types";
import { FC, Ref, useMemo } from "react";
import { CharacterEquipmentFields } from "@/api/enums";
import {
  useCharacterManagementContext,
  useMerchantContext,
} from "@/components/characters";
import { InventoryItem } from "./inventory-item";
import { useInventoryControlContext } from "./inventory-control-context";
import { fetchBackendApi } from "@/api/fetch";
import { filterItemsEntries, getSortedItems } from "@/components/items";
import { useAuthContext } from "@/components/auth";
import { useInventoryManagementContext } from ".";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ItemsPagination } from "./items-pagination";
import { usePagination } from "@/hooks/usePagination";
import { cn } from "@/lib/utils";
import { EmptyItemDisplay } from "@/components/items/item-display";

type InventoryItemsProps = {
  items?: InventoryItemsType;
  //TODO: move this to conetxt probably;
  dropRef: Ref<HTMLDivElement>;
  className?: string;
};
const PAGE_SIZE = 35;
export const InventoryItems: FC<InventoryItemsProps> = ({
  items,
  dropRef,
  className,
}) => {
  const { updateHeroDetails, fetchProfile } = useAuthContext();

  const { filter, sort } = useInventoryControlContext();
  const { setCurrentCharacterId, updateCharacter } =
    useCharacterManagementContext();
  const { manageInventoryItems } = useInventoryManagementContext();

  const { manageMerchantItems } = useMerchantContext();

  const itemsToRender = useMemo(
    () =>
      items ? getSortedItems(filterItemsEntries(items, filter), sort) : [],
    [items, filter, sort]
  );

  const {
    page,
    setPage,
    data: paginatedItems,
    pagesCount,
  } = usePagination(itemsToRender, PAGE_SIZE);

  const handleOnItemConsume = (itemId: string) => {
    fetchBackendApi<UseConsumableItem>({
      url: `characters/use-consumable/${itemId}`,
      method: "POST",
      notification: { pendingText: "Trying to use consumable item...." },
    }).then((response) => {
      const newHealth = response.body.data?.newHealth;
      if (!newHealth) return;
      updateHeroDetails({ health: newHealth });
      updateCharacter({ update: { health: newHealth } });
      manageInventoryItems({ type: "remove", id: itemId });
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
      manageInventoryItems({ type: "remove", id: itemId });
      setCurrentCharacterId(characterId, true);
    });
  };

  const handleOnMercenaryWear = (characterId: string, itemId: string) => {
    fetchBackendApi<EquipResponseType>({
      url: `characters/equip-mercenary/${characterId}/${itemId}`,
      method: "POST",
      notification: { pendingText: "Trying to equip mercenary..." },
    }).then(() => {
      manageInventoryItems({ type: "remove", id: itemId });
      setCurrentCharacterId(characterId, true);
    });
  };

  const handleOnSellItem = (id: string) => {
    fetchBackendApi<SellItemResponseType>({
      url: `merchants/sell-item/${id}`,
      method: "POST",
      notification: { pendingText: "Trying to sell item" },
    }).then((response) => {
      if (response?.body.data) {
        manageInventoryItems({ type: "remove", id });
        manageMerchantItems({ type: "sell", item: response.body.data });
        fetchProfile();
      }
    });
  };
  return (
    <div className="relative rounded-lg bg-gray-800/60 h-full flex flex-col overflow-hidden justify-between">
      <ScrollArea className="flex-grow min-h-[calc(100dvh-20rem)] ">
        <div className={cn(className)} ref={dropRef}>
          <div
            className={`grid grid-cols-6 xs:grid-cols-5 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 pr-2`}
          >
            {paginatedItems.map(([_, item]) => (
              <div key={item.id}>
                <InventoryItem
                  inventoryItem={item}
                  onItemEquip={(characterId, itemId, slot) =>
                    handleOnItemEquip(characterId, itemId, slot)
                  }
                  onItemConsume={(itemId) => handleOnItemConsume(itemId)}
                  onMercenaryWear={(characterId, itemId) =>
                    handleOnMercenaryWear(characterId, itemId)
                  }
                  onItemSell={handleOnSellItem}
                />
              </div>
            ))}
            {Array.from({
              length: Math.max(0, PAGE_SIZE - paginatedItems.length),
            }).map((_, i) => (
              <EmptyItemDisplay key={`empty-inv-${i}`} />
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="w-full bg-gray-800/90 h-12 p-1 border border-gray-700">
        <ItemsPagination
          pagesCount={pagesCount}
          page={page}
          onChangePage={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
};
