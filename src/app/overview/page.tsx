"use client";
import { DndProvider } from "react-dnd";
import CharacterDisplay from "./character-display";
import AdditionalTabs from "./additional-tabs";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  CharacterManagementContextProvider,
  MerchantContextProvider,
} from "@/components/characters";
import {
  Inventory,
  InventoryControlContextProvider,
  InventoryManagementContextProvider,
} from "@/components/characters/inventory";

export default function OverviewPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <CharacterManagementContextProvider>
        <InventoryControlContextProvider>
          <InventoryManagementContextProvider>
            <main className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-10rem)]">
              <div className="lg:w-[30dvw] lg:flex-shrink-0">
                <CharacterDisplay />
              </div>

              <MerchantContextProvider>
                <div className="flex-grow min-w-0 w-[20dvw]">
                  <Inventory />
                </div>
                <div className="lg:w-[420px] lg:flex-shrink-0">
                  <AdditionalTabs />
                </div>
              </MerchantContextProvider>
            </main>
          </InventoryManagementContextProvider>
        </InventoryControlContextProvider>
      </CharacterManagementContextProvider>
    </DndProvider>
  );
}
