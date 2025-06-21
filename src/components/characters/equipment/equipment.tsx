"use client";
import React from "react";
import styles from "./equipment.module.scss";
import { UnEquipResponseType } from "@/api/types";
import { CharacterEquipmentFields } from "@/api/enums";
import { FC } from "react";
import { useCharacterManagementContext } from "@/components/characters";
import { EquipmentItem } from "./equipment-item";
import { EmptyEquipmentSlot } from "./empty-equipment-slot";
import { isMercenaryCharacter } from "@/api/utils";
import { fetchBackendApi } from "@/api/fetch";
import {
  useInventoryControlContext,
  useInventoryManagementContext,
} from "../inventory";
import { MercenaryItemFielDnDWrapper } from "./mercenary-item-field-dnd-wrapper";
import { equipmentFieldToItemType } from "./slot-mapping";
import { cn } from "@/lib/utils";

export const Equipment: FC = () => {
  const {
    api: { data: characterData },
    fetchData: fetchCharacterData,
  } = useCharacterManagementContext();

  const { fetchData: fetchInventoryData } = useInventoryManagementContext();

  const { setFilter } = useInventoryControlContext();

  const handleOnItemUnEquip = (
    characterId: string,
    slot: CharacterEquipmentFields
  ) => {
    fetchBackendApi<UnEquipResponseType>({
      url: `characters/un-equip/${characterId}/${slot}`,
      method: "POST",
      notification: { pendingText: "Trying to un wear an item..." },
    }).then(() => {
      fetchInventoryData();
      fetchCharacterData();
    });
  };

  return (
    <>
      {Object.values(CharacterEquipmentFields).map((eqField) => {
        const currentSlot = characterData.equipment.slots[eqField];
        return (
          <div
            key={eqField}
            className={cn(
              "relative max-w-3/4 aspect-square rounded-lg bg-black/40 border-2 border-gray-600 flex flex-col items-center justify-center text-center text-xs text-gray-400 hover:bg-gray-700/50 hover:border-gray-500 transition-all",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              currentSlot ? "border-0" : "border-dashed"
            )}
            style={{ gridArea: eqField.toLowerCase() }}
          >
            {currentSlot ? (
              <EquipmentItem
                currentField={eqField}
                characterId={characterData.id}
                item={currentSlot}
                onItemUnEquip={(characterId, slot) =>
                  handleOnItemUnEquip(characterId, slot)
                }
              />
            ) : (
              <EmptyEquipmentSlot
                equipmentField={eqField}
                characterId={characterData.id}
                onClickEquipmentSlot={(slot) =>
                  setFilter((prevState) => ({
                    ...prevState,
                    showType: equipmentFieldToItemType[slot],
                  }))
                }
              />
            )}
          </div>
        );
      })}

      {isMercenaryCharacter(characterData) ? (
        <div className={styles.mercenaryItem}>
          <MercenaryItemFielDnDWrapper
            characterId={characterData.id}
            mercenaryItem={characterData.mercenary}
          />
        </div>
      ) : null}
    </>
  );
};
