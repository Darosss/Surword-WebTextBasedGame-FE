import {
  InventoryItemType,
  InventoryItems,
  ItemRarity,
  MerchantItemType,
  MerchantItems,
} from "@/api/types";
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
    border: "border-gray-400",
    bg: "bg-gray-600/80",
  },
  UNCOMMON: {
    text: "text-green-400",
    border: "border-green-400",
    bg: "bg-green-600/80",
  },
  RARE: {
    text: "text-blue-400",
    border: "border-blue-400",
    bg: "bg-blue-600/80",
  },
  VERY_RARE: {
    text: "text-purple-400",
    border: "border-purple-400",
    bg: "bg-purple-600/80",
  },
  EPIC: {
    text: "text-yellow-400",
    border: "border-yellow-400",
    bg: "bg-yellow-400/50",
  },
  LEGENDARY: {
    text: "text-orange-400",
    border: "border-orange-400",
    bg: "bg-orange-600/80",
  },
  MYTHIC: {
    text: "text-rose-400",
    border: "border-rose-400",
    bg: "bg-rose-600/80",
  },
};

export const filterItemsEntries = (
  items: InventoryItems,
  filter: FilterType
) => {
  //TODO: add improved filters fe: for cost merchant
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

export const filterMerchantItemsEntries = (
  items: MerchantItems,
  filter: FilterType
) => {
  //TODO: add improved filters fe: for cost merchant
  return Object.entries(items).filter(([_, { item: itemToFilter }]) => {
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

export const getSortedMerchantItems = (
  items: [string, MerchantItemType][],
  sort: SortType
) => {
  const sortedItems = items.sort(([, itemA], [, itemB]) => {
    if (itemA.item[sort.sortBy] < itemB.item[sort.sortBy]) {
      return -1;
    }
    if (itemA.item[sort.sortBy] > itemB.item[sort.sortBy]) {
      return 1;
    }
    return 0;
  });

  if (sort.descending) return sortedItems.reverse();
  return sortedItems;
};
