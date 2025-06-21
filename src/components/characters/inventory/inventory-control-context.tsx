"use client";
import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import type { FilterType, SortType } from "@/components/items";

type InventoryControlContextType = {
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
  sort: SortType;
  setSort: Dispatch<SetStateAction<SortType>>;
};

type InventoryControlContextProps = {
  children: React.ReactNode;
};

export const InventoryControlContext =
  createContext<InventoryControlContextType | null>(null);

export const InventoryControlContextProvider: FC<
  InventoryControlContextProps
> = ({ children }) => {
  const [filter, setFilter] = useState<FilterType>({
    name: null,
    showType: [],
  });
  const [sort, setSort] = useState<SortType>({
    sortBy: "name",
    descending: true,
  });
  return (
    <InventoryControlContext.Provider
      value={{ filter, setFilter, sort, setSort }}
    >
      {children}
    </InventoryControlContext.Provider>
  );
};

export const useInventoryControlContext =
  (): Required<InventoryControlContextType> => {
    const inventoryControlContext = useContext(InventoryControlContext);
    if (!inventoryControlContext) {
      throw new Error(
        "useInventoryControlContext must be used within a InventoryControlContextProvider"
      );
    }
    return inventoryControlContext as InventoryControlContextType;
  };
