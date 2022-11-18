import type { Area } from "@/types";
import { useRouter } from "preact-router";

interface AreaListProps {
  data: Pick<Area, "id" | "name">[];
}

export function AreaList({ data }: AreaListProps) {
  const [{ matches }] = useRouter();
  const current = Number(matches?.id);

  return (
    <div class="absolute z-10 top-5 left-5 p-2 w-60 h-[90vh] divide-y bg-gray-900 bg-opacity-80 divide-gray-900 divide-opacity-80 overflow-y-auto scrollbar:w-1.5 scrollbar:bg-transparent scrollbar-thumb:rounded scrollbar-thumb:bg-slate-500">
      {data.map((area) => (
        <a
          href={`/map/${area.id}`}
          class={`${
            area.id === current ? "font-bold text-lime-200" : "text-white"
          } group flex w-full items-center py-1 text-xs`}
        >
          {area.name}
        </a>
      ))}
    </div>
  );
}
