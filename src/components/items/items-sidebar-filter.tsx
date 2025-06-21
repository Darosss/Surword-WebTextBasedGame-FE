import { ItemType } from "@/api/enums";
import { Dispatch, FC, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { FilterType } from "./types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ItemsSidebarFilterProps = {
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
};

export const ItemsSidebarFilter: FC<ItemsSidebarFilterProps> = ({
  filter,
  setFilter,
}) => {
  return (
    <ScrollArea className="mb-4 whitespace-nowrap">
      <div className="flex space-x-2 pb-2">
        {Object.values(ItemType).map((type) => {
          const isChoosen = filter?.showType?.includes(type);
          return (
            <Button
              key={type}
              className={`border-gray-600 hover:bg-gray-700 text-xs h-8 ${
                isChoosen ? "bg-primary" : "bg-secondary"
              }`}
              onClick={() => {
                setFilter((prevState) => {
                  let newShowType: ItemType[] = [];
                  if (isChoosen) {
                    newShowType = prevState.showType.filter((filterType) => {
                      return filterType !== type;
                    });
                  } else {
                    newShowType = [...prevState.showType, type];
                  }

                  return {
                    ...prevState,
                    showType: newShowType,
                  };
                });
              }}
            >
              {type}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
