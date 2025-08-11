import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { FightReportDisplay } from "./fight-report-display";
import { FightReportType } from "@/api/types";
import { AnimatedFight } from "./animated-fight";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Gem } from "lucide-react";

type FightReportProps = {
  report: FightReportType;
  onClickConfirm: () => void;
};
export const FightReport: FC<FightReportProps> = ({
  report,
  onClickConfirm,
}) => {
  const [showReport, setShowReport] = useState(true);

  if (!showReport) return null;
  return (
    <div className="bg-transparent backdrop-blur-md absolute inset-0 z-[100]">
      <div className="sticky top-0 z-[101]">
        <Button
          onClick={() => {
            onClickConfirm();
            setShowReport(false);
          }}
          variant="success"
          className="w-full "
        >
          Confirm
        </Button>
      </div>

      <Tabs defaultValue="animated">
        <TabsList className="flex w-full gap-2 w-full">
          <TabsTrigger
            value="animated"
            className="flex items-center gap-2 py-2 bg-primary brightness-125"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Basic</span>
          </TabsTrigger>
          <TabsTrigger
            value="detailed"
            className="flex items-center gap-2 py-2 bg-primary brightness-125"
          >
            <Gem className="h-4 w-4" />
            <span className="hidden sm:inline">Detailed</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="animated">
          <AnimatedFight report={report} />
        </TabsContent>
        <TabsContent value="detailed">
          <FightReportDisplay report={report} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
