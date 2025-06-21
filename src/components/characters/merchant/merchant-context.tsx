"use client";
import { FC, createContext, useContext } from "react";
import { UseFetchReturnType, useFetch } from "@/hooks/useFetch";
import { YourMerchantResponseData } from "@/api/types";

type MerchantApiType = UseFetchReturnType<YourMerchantResponseData, unknown>;
type MerchantContextType = {
  apiMerchant: MerchantApiType;
};

type MerchantContextProps = {
  children: React.ReactNode;
};

export const MerchantContext = createContext<MerchantContextType | null>(null);

export const MerchantContextProvider: FC<MerchantContextProps> = ({
  children,
}) => {
  const apiMerchant = useFetch<YourMerchantResponseData>({
    url: "merchants/your-merchant",
    method: "GET",
  });

  return (
    <MerchantContext.Provider value={{ apiMerchant }}>
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
