"use client";
import { FC, createContext, useContext } from "react";
import { useFetch } from "@/hooks/useFetch";
import { Inventory as InventoryType } from "@/api/types";
import { FetchingInfo } from "@/components/common";
import { ApiInventoryFetchData, ApiInventoryState } from "./types";

type InventoryManagementContextType = {
  api: ApiInventoryState;
  fetchData: ApiInventoryFetchData;
};

type InventoryManagementContextProps = {
  children: React.ReactNode;
};

export const InventoryManagementContext =
  createContext<InventoryManagementContextType | null>(null);

export const InventoryManagementContextProvider: FC<
  InventoryManagementContextProps
> = ({ children }) => {
  const {
    api: { error, isPending, responseData },
    fetchData: fetchInventoryData,
  } = useFetch<InventoryType>({
    url: "your-inventory",
    method: "GET",
  });

  if (isPending === null || error || !responseData.data) {
    return (
      <FetchingInfo
        isPending={isPending}
        error={error}
        refetch={fetchInventoryData}
      />
    );
  }

  return (
    <InventoryManagementContext.Provider
      value={{
        api: responseData as ApiInventoryState,
        fetchData: fetchInventoryData,
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
