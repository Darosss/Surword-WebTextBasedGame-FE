"use client";
import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFetch } from "@/hooks/useFetch";
import { CharacterTypesAlias } from "@/api/types";
import { CharacterCreator } from "../creator";
import { FetchingInfo } from "@/components/common";
import { ApiCharacterState, ApiCharacterFetchData } from "./types";

type CharacterManagementContextType = {
  api: ApiCharacterState;
  fetchData: ApiCharacterFetchData;
  currentCharacterIdState: [
    string | null,
    Dispatch<SetStateAction<string | null>>
  ];
};

type CharacterManagementContextProps = {
  children: React.ReactNode;
};

export const CharacterManagementContext =
  createContext<CharacterManagementContextType | null>(null);

export const CharacterManagementContextProvider: FC<
  CharacterManagementContextProps
> = ({ children }) => {
  const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(
    null
  );
  const {
    api: { error, isPending, responseData },
    fetchData: fetchCharacterData,
  } = useFetch<CharacterTypesAlias>(
    {
      url: `${
        !currentCharacterId
          ? "characters/your-main-character"
          : `characters/${currentCharacterId}`
      }`,
      method: "GET",
    },
    { manual: currentCharacterId ? true : false }
  );

  useEffect(() => {
    if (currentCharacterId) fetchCharacterData();
  }, [currentCharacterId, fetchCharacterData]);

  if (
    isPending === null ||
    isPending ||
    (error && !error.includes("You do not have main character yet"))
    //TODO: refactor later -> error.includes as temporary solution.
  ) {
    return (
      <FetchingInfo
        isPending={isPending}
        error={error}
        refetch={fetchCharacterData}
      />
    );
  }

  return (
    <CharacterManagementContext.Provider
      value={{
        api: responseData as ApiCharacterState,
        fetchData: fetchCharacterData,
        currentCharacterIdState: [currentCharacterId, setCurrentCharacterId],
      }}
    >
      {responseData.data ? children : <CharacterCreator />}
    </CharacterManagementContext.Provider>
  );
};

export const useCharacterManagementContext =
  (): Required<CharacterManagementContextType> => {
    const characterManagementContext = useContext(CharacterManagementContext);
    if (!characterManagementContext) {
      throw new Error(
        "useCharacterManagementContext must be used within a CharacterManagementContextProvider"
      );
    }
    return characterManagementContext as CharacterManagementContextType;
  };
