"use client";
import { useFetch } from "@/hooks/useFetch";
import { HeroMercenaryCreate } from "./hero-mercenary-create";
import { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

//TODO: this will be from configs from backend latter.
const MAX_CHARACTERS_PER_USER = 4;

type HeroSelectProps = {
  currentCharacterId: string | null;
  setCurrentCharacterId: (id: string) => void;
  userId?: string;
};

export const HeroSelect: FC<HeroSelectProps> = ({
  currentCharacterId,
  setCurrentCharacterId,
  userId,
}) => {
  const {
    api: {
      responseData: { data: charactersIdsData },
    },
    fetchData: fetchCharactersIds,
  } = useFetch<string[]>({
    url: `${
      userId
        ? `characters/user/${userId}/characters-ids`
        : "characters/your-characters-ids"
    }`,
    method: "GET",
  });

  useEffect(() => {
    const firstCharacter = charactersIdsData?.at(0);
    if (userId && firstCharacter) setCurrentCharacterId(firstCharacter);
  }, [charactersIdsData, setCurrentCharacterId, userId]);
  {
  }
  return (
    <>
      {charactersIdsData?.map((id, index) => {
        const asCurrentChar =
          (!currentCharacterId && index === 0) ||
          currentCharacterId === id ||
          charactersIdsData.length === 1;
        return (
          <Button
            key={id}
            variant="outline"
            className={cn(
              "h-auto p-2 flex flex-col items-center gap-1 border-2 border-gray-700 hover:bg-gray-700/50 text-xs",
              asCurrentChar && "bg-blue-900/50 border-blue-500"
            )}
            onClick={() => setCurrentCharacterId(id)}
          >
            Hero {index + 1}
          </Button>
        );
      })}
      {(charactersIdsData?.length || 0) < MAX_CHARACTERS_PER_USER && !userId ? (
        <HeroMercenaryCreate onCreateMercenary={fetchCharactersIds} />
      ) : null}
    </>
  );
};
