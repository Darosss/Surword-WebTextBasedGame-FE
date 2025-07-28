import { FC } from "react";
import { Badge } from "../ui/badge";
import { Crown, Medal } from "lucide-react";

type RankBadgeProps = {
  rank: number;
};

export const RankBadge: FC<RankBadgeProps> = ({ rank }) => {
  switch (rank) {
    case 1:
      return (
        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
          <Crown className="h-3 w-3 mr-1" />
          1st
        </Badge>
      );
    case 2:
      return (
        <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-black">
          <Medal className="h-3 w-3 mr-1" />
          2nd
        </Badge>
      );
    case 3:
      return (
        <Badge className="bg-gradient-to-r from-orange-400 to-orange-600 text-black">
          <Medal className="h-3 w-3 mr-1" />
          3rd
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-gray-600 text-gray-300">
          #{rank}
        </Badge>
      );
  }
};
