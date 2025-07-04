"use client";
import { Dispatch, FC, SetStateAction } from "react";
import { FilterType, SortByKeysType, SortType } from "./types";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

type ItemsHeaderFilterProps = {
  setFilter: Dispatch<SetStateAction<FilterType>>;
  sort: SortType;
  setSort: Dispatch<SetStateAction<SortType>>;
};

export const sortByKeys: SortByKeysType[] = [
  "level",
  "name",
  "type",
  "value",
  "upgradePoints",
  "weight",
];

export const ItemsHeaderFilter: FC<ItemsHeaderFilterProps> = ({
  setFilter,
  sort,
  setSort,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search items..."
          className="pl-9 bg-gray-900/50 text-sm h-9"
          onChange={(e) =>
            setFilter((prevState) => ({
              ...prevState,
              name: e.target.value.toLowerCase(),
            }))
          }
        />
      </div>
      <Select
        onValueChange={(e) =>
          setSort((prevState) => ({
            ...prevState,
            sortBy: e as SortByKeysType,
          }))
        }
      >
        <SelectTrigger className="w-full sm:w-[160px] bg-gray-900/50 text-sm h-9">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent className="z-[100]">
          {sortByKeys.map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant={"outline"}
        onClick={() => {
          setSort((prevState) => ({
            ...prevState,
            descending: !prevState.descending,
          }));
        }}
      >
        {sort.descending ? "↓" : "↑"}
      </Button>
    </div>
  );
};
