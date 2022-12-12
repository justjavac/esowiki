import { getServiceAlerts, type ServerStatus, type ServerSupport, type ServiceAlert } from "@/utils/serviceAlerts";
import { useEffect } from "preact/hooks";

type ServerStatusProps = Record<string, ServiceAlert>;

export function ServerStatus(props: ServerStatusProps) {
  useEffect(() => {
    getServiceAlerts().then((alerts) => {
      props = alerts;
    });
  }, []);

  return (
    <ul
      role="list"
      class="mt-10 w-full divide-y divide-gray-200 rounded-md border border-gray-200"
    >
      {Object.values(props)
        .sort((x, y) => x.support.localeCompare(y.support))
        .map((x) => {
          if (x.support === "unknown" || x.zone === "unknown") {
            return;
          }
          return (
            <li
              key={x.slug}
              class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
            >
              <div class="flex w-0 flex-1 items-center">
                <span class="ml-2 w-0 flex-1">
                  {getSupportName(x.support)} ({getZoneName(x.zone)})
                </span>
              </div>
              <div class="ml-4 flex-shrink-0">
                <span
                  class={`font-medium inline-block px-2.5 py-1 rounded-full leading-none ${
                    getStatusColor(
                      x.status,
                    )
                  }`}
                >
                  {getStatusName(x.status)}
                </span>
              </div>
            </li>
          );
        })}
    </ul>
  );
}

function getZoneName(zone: string) {
  switch (zone) {
    case "eu":
      return "欧服";
    case "na":
      return "美服";
    default:
      return "未知";
  }
}

function getSupportName(support: ServerSupport) {
  switch (support) {
    case "pc":
      return "PC";
    case "xbox":
      return "Xbox";
    case "ps":
      return "PlayStation";
    default:
      return "未知";
  }
}

function getStatusName(status: ServerStatus) {
  switch (status) {
    case "up":
      return "在线";
    case "issues":
      return "维护中";
    case "down":
      return "离线";
    default:
      return "未知";
  }
}

function getStatusColor(status: ServerStatus) {
  switch (status) {
    case "up":
      return "bg-green-100 text-green-800";
    case "issues":
      return "bg-yellow-100 text-yellow-800";
    case "down":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
