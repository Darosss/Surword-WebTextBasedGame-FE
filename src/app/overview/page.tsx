"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  CharacterManagement,
  CharacterManagementContextProvider,
} from "@/components/characters";
import { InventoryManagementContextProvider } from "@/components/characters/inventory";

export default function Overview() {
  return (
    <main>
      <DndProvider backend={HTML5Backend}>
        <InventoryManagementContextProvider>
          <CharacterManagementContextProvider>
            <CharacterManagement />
          </CharacterManagementContextProvider>
        </InventoryManagementContextProvider>
      </DndProvider>
    </main>
  );
}
