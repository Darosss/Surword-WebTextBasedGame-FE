"use client";
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFetch } from "@/hooks/useFetch";
import { CharacterTypesAlias } from "@/api/types";
import { CharacterCreator } from "../creator";
import { FetchingInfo } from "@/components/common";
export type ApiCharacterState = Map<string, CharacterTypesAlias>;

type CharacterManagementContextType = {
  characters: ApiCharacterState;
  getCurrentSelectedCharacter: () => CharacterTypesAlias | null;
  currentCharacterId: string | null;
  setCurrentCharacterId: (id?: string, ignoreCache?: boolean) => void;
};

type CharacterManagementContextProps = {
  children: React.ReactNode;
};

const getFetchUrlHelper = (charId: string | null) =>
  `${!charId ? "characters/your-main-character" : `characters/${charId}`}`;

export const CharacterManagementContext =
  createContext<CharacterManagementContextType | null>(null);

export const CharacterManagementContextProvider: FC<
  CharacterManagementContextProps
> = ({ children }) => {
  const [characters, setCharacters] = useState<ApiCharacterState>(new Map());

  const [currentCharacterId, setCurrentCharacterIdState] = useState<
    string | null
  >(null);
  const {
    api: { error, isPending, responseData },
    fetchData: fetchCharacterData,
  } = useFetch<CharacterTypesAlias>(
    {
      url: getFetchUrlHelper(currentCharacterId),
      method: "GET",
    },
    { manual: true }
  );
  const getCurrentSelectedCharacter = () => {
    if (!currentCharacterId) return characters.values().next().value || null;
    else if (currentCharacterId)
      return characters.get(currentCharacterId) || null;
    return null;
  };

  const setCurrentCharacterId = useCallback(
    (id?: string, ignoreCache?: boolean) => {
      const currId = id || null;
      setCurrentCharacterIdState(currId);

      if (!ignoreCache && currId && characters.has(currId)) return;

      fetchCharacterData({
        customUrl: getFetchUrlHelper(currId),
      }).then((data) => {
        const responseData = data?.data;
        if (!responseData) return;

        setCharacters((prevState) => {
          const newMap = new Map(prevState);
          newMap.set(responseData.id, responseData);

          return newMap;
        });
      });
    },
    [characters, fetchCharacterData]
  );

  useEffect(() => {
    setCurrentCharacterId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    isPending === null ||
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
        getCurrentSelectedCharacter,
        characters,
        currentCharacterId,
        setCurrentCharacterId,
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
