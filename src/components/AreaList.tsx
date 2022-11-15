import type { Area } from "@/types";
import { useRouter } from "preact-router";

interface AreaListProps {
  data: Pick<Area, "id" | "name">[];
}

export default function AreaList({ data }: AreaListProps) {
  const [params] = useRouter();
  const current = Number(params.matches?.id);

  return (
    <div class="absolute z-10 top-5 left-5 p-2 w-60 h-[90vh] divide-y bg-gray-900 bg-opacity-80 divide-gray-900 divide-opacity-80 overflow-y-auto">
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
