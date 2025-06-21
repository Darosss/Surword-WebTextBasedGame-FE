import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartBig, Store } from "lucide-react";
import { Merchant } from "@/components/characters";

export default function AddionalTabs() {
  return (
    <div className="p-0 md:p-4 rounded-lg bg-gray-800/60 border-gray-700 border-0 md:border h-full flex flex-col">
      <Tabs defaultValue="activity" className="w-full flex flex-col flex-grow">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/80 border-b border-gray-700 h-12 p-1 sticky top-0 z-10">
          <TabsTrigger value="activity" className="h-full text-base gap-2">
            <BarChartBig className="h-5 w-5" />
            <span className="hidden sm:inline">Activity(soon)</span>
          </TabsTrigger>
          <TabsTrigger value="merchant" className="h-full text-base gap-2">
            <Store className="h-5 w-5" />
            <span className="hidden sm:inline">Merchant</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="merchant"
          className="mt-0 flex-grow overflow-y-auto"
        >
          <div className="p-4">
            <Merchant />
          </div>
        </TabsContent>

        <TabsContent
          value="activity"
          className="mt-0 flex-grow overflow-y-auto"
        >
          <div className="p-4">
            Soon....
            <div>Skirmish timer</div>
            <div>Dungeon timer</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
