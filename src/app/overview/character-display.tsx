"use client";
import type React from "react";
import { Equipment } from "@/components/characters/equipment";
import { useCharacterManagementContext } from "@/components/characters";
import { HeroSelect } from "@/components/characters/equipment/hero-select";
import HeroDetails from "./hero-details";

export default function CharacterDisplay() {
  const {
    currentCharacterIdState: [currentCharacterId, setCurrentCharacterId],
  } = useCharacterManagementContext();

  return (
    <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-yellow-300 border-b border-gray-600 pb-3 mb-4">
        Character
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 mb-4">
        <HeroSelect
          currentCharacterId={currentCharacterId}
          setCurrentCharacterId={setCurrentCharacterId}
        />
      </div>

      <div className="grid gap-1 character-equipment-grid pl-1 overflow-x-hidden">
        <Equipment />

        <div className="pr-4 relative" style={{ gridArea: "overview" }}>
          <HeroDetails />
        </div>
      </div>
    </div>
  );
}
