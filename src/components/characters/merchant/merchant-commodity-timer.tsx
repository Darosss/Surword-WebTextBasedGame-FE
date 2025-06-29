import { Button } from "@/components/ui/button";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { formatTime } from "@/utils/utils";
import { useMerchantContext } from "./merchant-context";
import { FC, useEffect } from "react";
import { RefreshCwIcon } from "lucide-react";

type MerchantCommodityTimerProps = {
  commodityRefreshAt: string;
};

export const MerchantCommodityTimer: FC<MerchantCommodityTimerProps> = ({
  commodityRefreshAt,
}) => {
  const commodityRemainingTime = useCountdownTimer({
    toTimestamp: commodityRefreshAt,
  });

  const { refetchMerchantItems } = useMerchantContext();

  useEffect(() => {
    if (commodityRemainingTime === 0) {
      refetchMerchantItems();
    }
  }, [refetchMerchantItems, commodityRemainingTime]);

  return (
    <div className="w-full flex justify-between items-center">
      <div>{formatTime(commodityRemainingTime)}</div>
      <div>
        <Button variant="outline" disabled>
          <RefreshCwIcon />
        </Button>
      </div>
    </div>
  );
};
