import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Character, NpcEnemy } from "@/api/types";
import { motion } from "framer-motion";

interface ParticipantCardProps {
  participant: Character | NpcEnemy;
  team: 1 | 2;
}

export default function ParticipantCard({
  participant,
  team,
}: ParticipantCardProps) {
  const maxHp =
    participant.stats.additionalStatistics["MAX_HEALTH"].effectiveValue;
  const hpPercentage =
    participant.health > 0 ? (participant.health / maxHp) * 100 : 0;
  const hpColor =
    hpPercentage > 60
      ? "[&>*]:bg-green-500"
      : hpPercentage > 30
      ? "[&>*]:bg-yellow-500"
      : "[&>*]:bg-red-600";
  const isDefeated = participant.health <= 0;

  return (
    <motion.div
      initial={{ filter: "brightness(2)" }}
      animate={{ filter: "brightness(1)" }}
      className={cn(
        "rounded-lg p-3 sm:p-4 border-2 bg-gray-800/60 flex flex-col items-center text-center shadow-lg relative overflow-hidden",
        team === 1 ? "border-blue-600/70" : "border-red-600/70",
        isDefeated && "opacity-60"
      )}
    >
      {isDefeated && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <span className="text-red-500 font-bold text-sm transform -rotate-12">
            DEFEATED
          </span>
        </div>
      )}
      <Image
        src="/images/hero-placeholder.png"
        alt={participant.name}
        width={80}
        height={80}
        className="rounded-full border-2 border-gray-600 mb-2 sm:mb-3 object-cover w-16 h-16 sm:w-20 sm:h-20"
      />
      <h4 className="text-sm sm:text-md font-semibold text-gray-100 truncate w-full px-1">
        {participant.name}
      </h4>
      <p className="text-xs text-gray-400 mb-1.5 sm:mb-2">
        HP: {participant.health} / {maxHp}
      </p>
      <Progress
        value={hpPercentage}
        className={cn("h-2 sm:h-2.5 w-full bg-gray-700", hpColor)}
      />
    </motion.div>
  );
}
