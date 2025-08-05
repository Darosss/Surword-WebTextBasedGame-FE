"use client";
import { FC, createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import {
  Inventory,
  InventoryItemType,
  Inventory as InventoryType,
} from "@/api/types";
import { FetchingInfo } from "@/components/common";

type ManageInventoryItemsRemove = {
  id: string;
  type: "remove";
};

type ManageInventoryItemsAdd = {
  type: "add";
  item: InventoryItemType;
};

type ManageInventoryItems =
  | ManageInventoryItemsRemove
  | ManageInventoryItemsAdd;

type InventoryManagementContextType = {
  items: Inventory["items"];
  maxItems: Inventory["maxItems"];
  maxWeight: Inventory["maxWeight"];
  currentWeight: Inventory["currentWeight"];
  fetchInventory: () => void;
  manageInventoryItems: (data: ManageInventoryItems) => void;
};

type InventoryManagementContextProps = {
  children: React.ReactNode;
};

export const InventoryManagementContext =
  createContext<InventoryManagementContextType | null>(null);

export const InventoryManagementContextProvider: FC<
  InventoryManagementContextProps
> = ({ children }) => {
  const [items, setItems] = useState<InventoryManagementContextType["items"]>();
  const [maxItems, setMaxItems] =
    useState<InventoryManagementContextType["maxItems"]>(10);
  const [maxWeight, setMaxWeight] =
    useState<InventoryManagementContextType["maxWeight"]>(10);
  const [currentWeight, setCurrentWeight] =
    useState<InventoryManagementContextType["currentWeight"]>(0);

  const {
    api: { error, isPending, responseData },
    fetchData: fetchInventoryData,
  } = useFetch<InventoryType>(
    {
      url: "your-inventory",
      method: "GET",
    },
    { manual: true }
  );

  const removeItem = (id: string) => {
    const foundItem = items?.[id];
    if (!foundItem) return;
    const itemWeight = foundItem.weight;

    setItems((prevState) => {
      if (!prevState) return;
      delete prevState[id];

      return { ...prevState };
    });
    setCurrentWeight((prevState) => prevState - itemWeight);
  };

  const addNewItem = (item: InventoryItemType) => {
    if (!items) return;
    const { id, weight } = item;

    setItems((prevState) => {
      if (!prevState) return;
      prevState[id] = item;

      return { ...prevState };
    });
    setCurrentWeight((prevState) => prevState + weight);
  };

  const manageInventoryItems = (data: ManageInventoryItems) => {
    if (data.type === "remove") {
      const { id } = data;
      removeItem(id);
    } else if (data.type === "add") {
      const { item } = data;
      addNewItem(item);
    }
  };

  useEffect(() => {
    fetchInventoryData().then((response) => {
      const responseData = response?.data;
      if (!responseData) return;

      const { currentWeight, items, maxItems, maxWeight } = responseData;

      setCurrentWeight(currentWeight);
      setItems(items);
      setMaxItems(maxItems);
      setMaxWeight(maxWeight);
    });
  }, [fetchInventoryData]);

  if (error || !responseData.data) {
    return (
      <FetchingInfo
        isPending={false}
        error={error}
        refetch={fetchInventoryData}
      />
    );
  }

  return (
    <InventoryManagementContext.Provider
      value={{
        items: items || {},
        maxItems,
        maxWeight,
        currentWeight,
        fetchInventory: fetchInventoryData,
        manageInventoryItems,
      }}
    >
      {children}
    </InventoryManagementContext.Provider>
  );
};

export const useInventoryManagementContext =
  (): Required<InventoryManagementContextType> => {
    const inventoryManagementContext = useContext(InventoryManagementContext);
    if (!inventoryManagementContext) {
      throw new Error(
        "useInventoryManagementContext must be used within a InventoryManagementContextProvider"
      );
    }
    return inventoryManagementContext as InventoryManagementContextType;
  };
