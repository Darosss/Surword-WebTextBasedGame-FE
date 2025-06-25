import { Dungeons } from "@/components/dungeons";

export default async function DungeonsPage() {
  return (
    <main>
      <div className="flex flex-col flex-grow gap-4 min-h-[calc(100vh-10rem)]">
        <div className="w-full p-4 rounded-lg bg-gray-800/60 border border-gray-700 h-full flex flex-col">
          <h2 className="text-2xl font-bold text-yellow-300 border-b border-gray-600 pb-3 mb-4">
            Dungeons
          </h2>
          <Dungeons />
        </div>
      </div>
    </main>
  );
}
