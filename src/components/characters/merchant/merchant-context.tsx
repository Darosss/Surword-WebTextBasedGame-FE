"use client";
import { FC, createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { MerchantItemType, YourMerchantResponseData } from "@/api/types";

type ManageMerchantItemsRemove = {
  id: string;
  type: "buy";
};

type ManageMerchantItemsAdd = {
  type: "sell";
  item: MerchantItemType;
};

type ManageMerchantItems = ManageMerchantItemsRemove | ManageMerchantItemsAdd;

type MerchantContextType = {
  commodityRefreshAt: YourMerchantResponseData["commodityRefreshAt"];
  items: YourMerchantResponseData["items"];
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

  const addNewItem = (data: MerchantItemType) => {
    if (!items) return;

    setItems((prevState) => {
      prevState[data.item.id] = data;

      return { ...prevState };
    });
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

      const { commodityRefreshAt, items } = responseData;

      setItems(items);
      setCommodityRefreshAt(commodityRefreshAt);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MerchantContext.Provider
      value={{
        commodityRefreshAt,
        items,
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
