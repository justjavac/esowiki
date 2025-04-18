import { effect, signal, useComputed } from "@preact/signals";
import { Achievements, Filters, Housing } from "@/components";
import { CDN_URL } from "@/consts";
import type { IconType } from "@/types";

const active = signal<IconType>(
  import.meta.env.SSR ? "filters" : (localStorage.getItem("activeTab") as IconType) ?? "filters",
);

effect(() => {
  if (import.meta.env.SSR) return;
  localStorage.setItem("activeTab", active.value);
});

export function Sidebar() {
  const activeComponent = useComputed(() => {
    switch (active.value) {
      case "quests":
        return <div>任务</div>;
      case "key":
        return <div>Key</div>;
      case "filters":
        return <Filters />;
      case "achievements":
        return <Achievements />;
      case "housing":
        return <Housing />;
      default:
        return null;
    }
  });

  return (
    <div class="absolute flex flex-col top-20 right-5 pt-2 w-60 h-[80vh] divide-y bg-gray-900 bg-opacity-80 divide-gray-900 divide-opacity-80">
      <div class="flex px-2">
        <Icon type="quests" title="任务" />
        <Icon type="key" title="" />
        <Icon type="filters" title="筛选" />
        <Icon type="achievements" title="成就" />
        <Icon type="housing" title="房屋" />
      </div>
      <div class="w-full p-2 text-xs text-white overflow-y-auto scrollbar:w-1.5 scrollbar:bg-transparent scrollbar-thumb:rounded scrollbar-thumb:bg-slate-500">
        {activeComponent.value}
      </div>
    </div>
  );
}

interface IconProps {
  type: IconType;
  title: string;
}

function Icon({ type, title }: IconProps) {
  const src = useComputed(() => {
    if (active.value === type) {
      return `${CDN_URL}/icons/${type}_down.png?imageMogr2/format/webp`;
    }
    return `${CDN_URL}/icons/${type}_up.png?imageMogr2/format/webp`;
  });

  return (
    <div class="w-full pb-1 text-sm font-medium text-blue-700">
      <img
        src={src}
        alt=""
        onClick={() => (active.value = type)}
        title={title}
      />
    </div>
  );
}
