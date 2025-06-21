"use client";
import React from "react";
import styles from "./equipment.module.scss";
import { CharacterEquipmentFields } from "@/api/enums";
import { FC } from "react";
import { useCharacterManagementContext } from "@/components/characters";
import { EquipmentItem } from "./equipment-item";
import { EmptyEquipmentSlot } from "./empty-equipment-slot";
import { isMercenaryCharacter } from "@/api/utils";
import { HeroSelect } from "./hero-select";
import { MercenaryItemField } from "./mercenary-item-field";

//TODO: refactor
//Note; this components is almost a copy of equipment.tsx
//Later refactor and make reusable

type OtherUserEquipmentProps = {
  userId: string;
};

export const OtherUserEquipment: FC<OtherUserEquipmentProps> = ({ userId }) => {
  const {
    api: { data: characterData },
    currentCharacterIdState: [currentCharacterId, setCurrentCharacterId],
  } = useCharacterManagementContext();

  return (
    <div className={styles.equipmentWrapper}>
      <div className={styles.equipmentContainer}>
        {Object.values(CharacterEquipmentFields).map((eqField) => {
          const currentSlot = characterData.equipment.slots[eqField];
          return (
            <div key={eqField} className={styles[eqField.toLowerCase()]}>
              <div className={styles.background}></div>

              {currentSlot ? (
                <EquipmentItem
                  currentField={eqField}
                  characterId={characterData.id}
                  item={currentSlot}
                />
              ) : (
                <EmptyEquipmentSlot
                  equipmentField={eqField}
                  characterId={characterData.id}
                />
              )}
            </div>
          );
        })}
        <div className={styles.heroSelect}>
          <HeroSelect
            currentCharacterId={currentCharacterId}
            setCurrentCharacterId={setCurrentCharacterId}
            userId={userId}
          />
        </div>
        {isMercenaryCharacter(characterData) ? (
          <div className={styles.mercenaryItem}>
            <MercenaryItemField mercenaryItem={characterData.mercenary} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
