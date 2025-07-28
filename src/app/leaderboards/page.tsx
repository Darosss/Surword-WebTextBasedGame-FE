import { Leaderboards } from "@/components/leaderboards";

export default async function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-yellow-300 mb-2">
          Leaderboards
        </h1>
        <p className="text-gray-400">
          See how you rank against other adventurers across the realm
        </p>

        <Leaderboards />
      </div>
    </div>
  );
}
