"use client";
import { FC, createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { InventoryItemType, YourMerchantResponseData } from "@/api/types";

type ManageMerchantItemsRemove = {
  id: string;
  type: "buy";
};

type ManageMerchantItemsAdd = {
  type: "sell";
  item: InventoryItemType;
};

type ManageMerchantItems = ManageMerchantItemsRemove | ManageMerchantItemsAdd;

type MerchantContextType = {
  commodityRefreshAt: YourMerchantResponseData["commodityRefreshAt"];
  items: YourMerchantResponseData["items"];
  itemsCost: YourMerchantResponseData["itemsCost"];
  manageMerchantItems: (data: ManageMerchantItems) => void;
  refetchMerchantItems: () => void;
};

type MerchantContextProps = {
  children: React.ReactNode;
};

export const MerchantContext = createContext<MerchantContextType | null>(null);

export const MerchantContextProvider: FC<MerchantContextProps> = ({
  children,
}) => {
  const [items, setItems] = useState<MerchantContextType["items"]>({});
  const [itemsCost, setItemsCost] = useState<MerchantContextType["itemsCost"]>(
    {}
  );
  const [commodityRefreshAt, setCommodityRefreshAt] = useState<
    MerchantContextType["commodityRefreshAt"]
  >(new Date().toLocaleDateString());

  const { api, fetchData: fetchMerchantData } =
    useFetch<YourMerchantResponseData>(
      {
        url: "merchants/your-merchant",
        method: "GET",
      },
      { manual: true }
    );

  const removeItem = (id: string) => {
    const foundItem = items?.[id];
    if (!foundItem) return;

    setItems((prevState) => {
      delete prevState[id];

      return { ...prevState };
    });
  };

  const addNewItem = (item: InventoryItemType) => {
    if (!items) return;
    const { id } = item;

    setItems((prevState) => {
      prevState[id] = item;

      return { ...prevState };
    });

    if (!itemsCost[id])
      setItemsCost((prevState) => ({
        ...prevState,
        [id]: item.value,
      }));
  };

  const manageMerchantItems = (data: ManageMerchantItems) => {
    if (data.type === "buy") {
      const { id } = data;
      removeItem(id);
    } else if (data.type === "sell") {
      const { item } = data;
      addNewItem(item);
    }
  };

  useEffect(() => {
    fetchMerchantData().then((response) => {
      const responseData = response?.data;
      if (!responseData) return;

      const { commodityRefreshAt, items, itemsCost } = responseData;

      setItems(items);
      setCommodityRefreshAt(commodityRefreshAt);
      setItemsCost(itemsCost);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MerchantContext.Provider
      value={{
        commodityRefreshAt,
        items,
        itemsCost,
        manageMerchantItems,
        refetchMerchantItems: fetchMerchantData,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchantContext = (): Required<MerchantContextType> => {
  const merchantContext = useContext(MerchantContext);
  if (!merchantContext) {
    throw new Error(
      "useMerchantContext must be used within a MerchantContextProvider"
    );
  }
  return merchantContext as MerchantContextType;
};
