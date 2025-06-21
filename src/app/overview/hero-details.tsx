"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AdditionalStatistics,
  BaseDetails,
  BaseStatistics,
} from "@/components/characters/details/statistics";
import { useCharacterManagementContext } from "@/components/characters";

export default function HeroDetails() {
  const {
    api: { data: characterData },
  } = useCharacterManagementContext();

  return (
    <div className="space-y-4">
      <Accordion
        type="multiple"
        defaultValue={["overview", "core-attributes"]}
        className="w-full"
      >
        <AccordionItem value="overview">
          <AccordionTrigger className="text-md font-semibold hover:no-underline py-3">
            Details
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-1">
            <BaseDetails character={characterData} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="core-attributes">
          <AccordionTrigger className="text-md font-semibold hover:no-underline py-3">
            Core Attributes
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-1">
            <Tabs defaultValue="overview_stats" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 h-10 text-sm">
                <TabsTrigger value="overview_stats">Overview</TabsTrigger>
                <TabsTrigger value="train_stats">Train</TabsTrigger>
              </TabsList>

              <TabsContent value="overview_stats" className="mt-3">
                <BaseStatistics statistics={characterData.stats.statistics} />
              </TabsContent>

              <TabsContent value="train_stats" className="mt-3">
                <BaseStatistics
                  statistics={characterData.stats.statistics}
                  canTrain={{
                    onSuccesTrain: () => {
                      //TODO: add on success
                    },
                  }}
                />
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="combat-stats">
          <AccordionTrigger className="text-md font-semibold hover:no-underline py-3">
            Combat Statistics
          </AccordionTrigger>
          <AccordionContent className="relative pt-0 pb-1">
            <AdditionalStatistics
              statistics={characterData.stats.additionalStatistics}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
