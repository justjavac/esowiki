import type { Area } from "@/types";
import { useRouter } from "preact-router";
import { Search } from "@/components";

interface AreaListProps {
  data: Pick<Area, "id" | "name">[];
}

export function AreaList({ data }: AreaListProps) {
  const [{ matches }] = useRouter();
  const current = Number(matches?.id);

  return (
    <div class="absolute flex flex-col z-10 top-20 left-10 h-[80vh] rounded-md bg-gray-900 bg-opacity-80">
      <Search />
      <div
        class="w-60 px-2 mt-2 divide-y divide-gray-900 divide-opacity-80 overflow-y-auto scrollbar:w-1.5 scrollbar:bg-transparent scrollbar-thumb:rounded scrollbar-thumb:bg-slate-500"
        id="area-list"
      >
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
    </div>
  );
}
