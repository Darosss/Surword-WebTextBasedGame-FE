"use client";
import React from "react";
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
  const { getCurrentSelectedCharacter, setCurrentCharacterId } =
    useCharacterManagementContext();

  const currentCharacter = getCurrentSelectedCharacter();

  const { manageInventoryItems } = useInventoryManagementContext();

  const { setFilter } = useInventoryControlContext();

  const handleOnItemUnEquip = (
    characterId: string,
    slot: CharacterEquipmentFields
  ) => {
    fetchBackendApi<UnEquipResponseType>({
      url: `characters/un-equip/${characterId}/${slot}`,
      method: "POST",
      notification: { pendingText: "Trying to un wear an item..." },
    }).then((response) => {
      const responseData = response.body.data;

      if (responseData) {
        manageInventoryItems({ type: "add", item: responseData });
        setCurrentCharacterId(characterId, true);
      }
    });
  };

  return (
    <>
      {Object.values(CharacterEquipmentFields).map((eqField) => {
        const currentSlot = currentCharacter?.equipment.slots[eqField];
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
                characterId={currentCharacter.id}
                item={currentSlot}
                onItemUnEquip={(characterId, slot) =>
                  handleOnItemUnEquip(characterId, slot)
                }
              />
            ) : (
              <EmptyEquipmentSlot
                equipmentField={eqField}
                characterId={currentCharacter?.id}
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

      {currentCharacter && isMercenaryCharacter(currentCharacter) && (
        <div
          className={cn(
            "relative max-w-3/4 aspect-square rounded-lg bg-black/40 border-2 border-gray-600 flex flex-col items-center justify-center text-center text-xs text-gray-400 hover:bg-gray-700/50 hover:border-gray-500 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            currentCharacter.mercenary ? "border-0" : "border-dashed"
          )}
          style={{ gridArea: "mercenary" }}
        >
          <MercenaryItemFielDnDWrapper
            mercenaryItem={currentCharacter.mercenary}
            characterId={currentCharacter.id}
          />
        </div>
      )}
    </>
  );
};
