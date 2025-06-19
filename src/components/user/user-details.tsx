import { FC } from "react";
import { useAuthContext } from "@/components/auth";
import { Coins, Star, BarChartBig } from "lucide-react";

export const UserDetails: FC = () => {
  const {
    apiUser: { api },
  } = useAuthContext();

  const {
    user: { username, gold },
    heroDetails: hero,
  } = api.data;

  if (!username) return null;
  const xpPercentage = !hero ? 0 : (hero.experience / hero.neededExp) * 100;

  return (
    <div className="p-4 space-y-4 border-b border-gray-700/50">
      <h2 className="text-xl font-bold text-yellow-300">{username}</h2>
      <div className="space-y-2 text-sm text-gray-300">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-yellow-400" /> Gold
          </span>
          <span>{gold.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Star className="h-4 w-4 text-blue-400" /> Level
          </span>
          <span>{hero?.level}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BarChartBig className="h-4 w-4 text-green-400" /> XP
          </span>
          <span>
            {hero?.experience} / {hero?.neededExp}
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-green-400 to-teal-500 h-2.5 rounded-full"
          style={{ width: `${xpPercentage}%` }}
        />
      </div>
    </div>
  );
};
