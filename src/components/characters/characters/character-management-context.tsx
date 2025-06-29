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
import {
  CharacterTypesAlias,
  MainCharacter,
  MercenaryCharacter,
} from "@/api/types";
import { CharacterCreator } from "../creator";
import { FetchingInfo } from "@/components/common";
import { isMercenaryCharacter } from "@/api/utils";
export type ApiCharacterState = Map<string, CharacterTypesAlias>;
type UpdateCharacterParams =
  | {
      update: Partial<MainCharacter>;
    }
  | {
      id: string;
      update: Partial<MercenaryCharacter>;
    };

type CharacterManagementContextType = {
  characters: ApiCharacterState;
  getCurrentSelectedCharacter: () => CharacterTypesAlias | null;
  currentCharacterId: string | null;
  setCurrentCharacterId: (id?: string, ignoreCache?: boolean) => void;
  updateCharacter: (params: UpdateCharacterParams) => void;
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

  const updateCharacter = (params: UpdateCharacterParams) => {
    if ("id" in params) {
      const { id, update } = params;
      if (!characters.has(id)) return;
      setCharacters((prevState) => {
        const newMap = new Map(prevState);

        newMap.set(id, { ...newMap.get(id)!, ...update });

        return newMap;
      });
    } else {
      const { update } = params;

      setCharacters((prevState) => {
        const newMap = new Map(prevState);

        for (const [id, value] of newMap.entries()) {
          if (!isMercenaryCharacter(value)) {
            newMap.set(id, { ...newMap.get(id)!, ...update });
            break;
          }
        }
        return newMap;
      });
    }
  };

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
        updateCharacter,
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
