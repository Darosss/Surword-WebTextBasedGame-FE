"use client";

import { useFetch } from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { FC, useEffect } from "react";
import { useCharacterManagementContext } from "@/components/characters";

/* TODO: 
here i need to add later:
- character profession
- character sex
etc, itp
for now it's just create button 
*/

export const CharacterCreator: FC = () => {
  const { setCurrentCharacterId } = useCharacterManagementContext();

  const {
    api: { responseData },
    fetchData,
  } = useFetch(
    { url: "characters/create", method: "POST" },
    {
      manual: true,
      notification: { pendingText: "Trying to create main character" },
    }
  );

  useEffect(() => {
    if (responseData.data) setCurrentCharacterId();
  }, [responseData.data, setCurrentCharacterId]);

  return (
    <div className="flex flex-col grow items-center">
      <h1 className="text-3xl">Character creator</h1>

      <div>
        <Button variant="warning" onClick={() => fetchData()}>
          Create main character
        </Button>
      </div>
    </div>
  );
};
