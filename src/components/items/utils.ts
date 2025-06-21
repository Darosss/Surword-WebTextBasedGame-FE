import { InventoryItemType, InventoryItems, ItemRarity } from "@/api/types";
import { isWearableItem } from "@/api/utils";
import { FilterType, SortType } from "./types";

type RarityStylesType = {
  text: string;
  border: string;
  bg: string;
};

export const rarityStyles: Record<ItemRarity, RarityStylesType> = {
  COMMON: {
    text: "text-gray-300",
    border: "border-gray-600",
    bg: "bg-gray-800/50",
  },
  UNCOMMON: {
    text: "text-green-400",
    border: "border-green-700",
    bg: "bg-green-900/40",
  },
  RARE: {
    text: "text-blue-400",
    border: "border-blue-700",
    bg: "bg-blue-900/40",
  },
  VERY_RARE: {
    text: "text-purple-400",
    border: "border-purple-700",
    bg: "bg-purple-900/40",
  },
  EPIC: {
    text: "text-orange-400",
    border: "border-orange-600",
    bg: "bg-orange-900/40",
  },
  LEGENDARY: {
    text: "text-orange-400",
    border: "border-orange-600",
    bg: "bg-orange-900/40",
  },
  MYTHIC: {
    text: "text-yellow-400",
    border: "border-yellow-600",
    bg: "bg-yellow-900/40",
  },
};

export const filterItemsEntries = (
  items: InventoryItems,
  filter: FilterType
) => {
  return Object.entries(items).filter(([_, itemToFilter]) => {
    const { showType, name } = filter;
    let itemFiltered = true;
    if (showType)
      itemFiltered =
        showType.length === 0 ? true : showType.includes(itemToFilter.type);
    if (name && itemFiltered)
      itemFiltered = (
        isWearableItem(itemToFilter)
          ? itemToFilter.nameWithPrefixAndSuffix
          : itemToFilter.name
      )
        .toLowerCase()
        .includes(name);
    return itemFiltered;
  });
};
export const getSortedItems = (
  items: [string, InventoryItemType][],
  sort: SortType
) => {
  const sortedItems = items.sort(([, itemA], [, itemB]) => {
    if (itemA[sort.sortBy] < itemB[sort.sortBy]) {
      return -1;
    }
    if (itemA[sort.sortBy] > itemB[sort.sortBy]) {
      return 1;
    }
    return 0;
  });

  if (sort.descending) return sortedItems.reverse();
  return sortedItems;
};
