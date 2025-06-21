import { ItemType } from "@/api/enums";

import styles from "./equipment.module.scss";
import { ItemMercenary } from "@/api/types";
import { ItemDisplay } from "@/components/items";

import Image from "next/image";

import { FC } from "react";

export type MercenaryItemFieldProps = {
  mercenaryItem?: ItemMercenary;
  itemDisplayOpacity?: number;
  itemDisplayRefWrapper?: React.Ref<HTMLDivElement> | undefined;
};

export const MercenaryItemField: FC<MercenaryItemFieldProps> = ({
  mercenaryItem,
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
