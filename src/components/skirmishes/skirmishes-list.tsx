"use client";

import { useFetch } from "@/hooks/useFetch";
import { ChallengeData, ChoosenChallange } from "./types";
import { FC } from "react";
import { FetchingInfo } from "@/components/common";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { CurrentChallenge } from "./current-challenge";
import { useAuthContext } from "../auth";
import { toast } from "react-toastify";

type SkirmishesResponse = {
  challenges: Record<string, ChallengeData>;
  challengeTimeCompleted: boolean;
  chosenChallenge?: ChoosenChallange;
  chosenChallengeData?: ChallengeData;
  id: string;
};

export const SkirmishesList: FC = () => {
  const {
    api: {
      isPending,
      error,
      responseData: { data },
    },
    fetchData,
  } = useFetch<SkirmishesResponse>({
    url: "your-skirmishes",
    method: "GET",
  });

  if (!data || isPending || error) {
    return (
      <FetchingInfo isPending={isPending} error={error} refetch={fetchData} />
    );
  }

  return (
    <div className="flex flex-col items-center h-full w-full justify-between relative overflow-y-auto">
      <div className="flex flex-wrap gap-3 justify-center">
        <SkirmishesData challenges={data.challenges} onStart={fetchData} />
      </div>
      {data.chosenChallenge && data.chosenChallengeData && (
        <div className="absolute top-0 text-center bottom-0 left-0 right-0 backdrop-blur-lg w-full">
          <CurrentChallenge
            chosenChallenge={data.chosenChallenge}
            chosenChallengeData={data.chosenChallengeData}
            onConfirmReport={fetchData}
            onCancel={fetchData}
          />
        </div>
      )}
    </div>
  );
};

type SkirmishesDataProps = {
  challenges: SkirmishesResponse["challenges"];
  onStart: () => void;
};

const SkirmishesData = ({ challenges, onStart }: SkirmishesDataProps) => {
  const {
    api: {
      isPending,
      error,
      responseData: { data },
    },
    fetchData,
  } = useFetch<String>(
    {
      url: `start-challenge/`,
      method: "POST",
    },
    { manual: true }
  );

  const { heroDetails } = useAuthContext();

  const handleOnStartChallenge = (id: number) => {
    if (!heroDetails) return;

    const minHealthToStart = heroDetails.maxHealth * 0.1;
    if (heroDetails.health <= minHealthToStart) {
      return toast.info(
        `You need at least ${
          Math.round(minHealthToStart) + 1
        }HP to start a fight!`
      );
    }
    fetchData({ customUrl: `start-challenge/${id}` }).then((data) => {
      if (data?.data) onStart();
    });
  };
  return Object.entries(challenges).map(([id, value]) => (
    <Popover key={id}>
      <PopoverTrigger asChild>
        <div className="flex flex-col w-64">
          <Button className="flex flex-col h-full">
            {value.name}
            <span className="p-2 bg-warning rounded-md text-warning text-center">
              {" "}
              {value.difficulty}
            </span>
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent>
        <div className="backdrop-blur-lg w-xl rounded-md border bg-gradient-to-br from-blue-900 to-gray-900 p-6">
          <h2 className="text-2xl font-bold text-yellow-300 border-b border-gray-600 pb-3 mb-4">
            {value.name}
          </h2>
          <div className="text-lg font-bold text-yellow-300 border-b border-gray-600 pb-3 mb-4">
            Description...(soon)
          </div>

          <Button
            variant="warning"
            onClick={() => handleOnStartChallenge(parseInt(id, 10))}
          >
            {" "}
            Start{" "}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ));
};
