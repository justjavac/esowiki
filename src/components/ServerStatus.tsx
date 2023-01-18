import { useEffect, useState } from "preact/hooks";
import { Announce } from ".";

interface ServerStatus {
  slug: string;
  platform: string;
  zone: string;
  status: boolean;
}

type ServerStatusProps = {
  servers: ServerStatus[];
  message: string;
  updatedAt: string;
};

export function ServerStatus(props: ServerStatusProps) {
  const [data, setData] = useState<ServerStatusProps>(props);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const timmer = setInterval(async () => {
      setLoading(true);
      fetch("", { headers })
        .then((response) => response.json())
        .then(setData)
        .finally(() => setLoading(false));
    }, 1000 * 60);
    return () => {
      clearInterval(timmer);
    };
  }, []);

  const intl = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    dateStyle: "medium",
    timeStyle: "medium",
  });
  const localTime = intl.format(new Date(data.updatedAt));

  return (
    <div class="mx-4 md:mx-0">
      <div class="mt-10 p-4 w-full flex justify-between rounded-md border border-gray-200 text-gray-500 text-sm">
        <strong>最后更新时间:</strong>
        <div class="inline-flex">
          {loading && <Spin />}
          <time dateTime={data.updatedAt}>{localTime}</time>
        </div>
      </div>

      {data.message && <Announce class="my-4" message={data.message} />}

      <ul
        role="list"
        class="mt-10 w-full divide-y divide-gray-200 rounded-md border border-gray-200"
      >
        {data.servers
          .sort((x, y) => x.platform.localeCompare(y.platform))
          .map((x) => {
            return (
              <li
                key={x.slug}
                class="flex items-center justify-between p-3 text-sm"
              >
                <div class="flex w-0 flex-1 items-center">
                  <span class="ml-2 w-0 flex-1">
                    {x.platform} ({x.zone})
                  </span>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <span
                    class={`font-medium inline-block px-2.5 py-1 rounded-full leading-none ${getStatusColor(
                      x.status
                    )}`}
                  >
                    {getStatusName(x.status)}
                  </span>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

function Spin() {
  return (
    <svg
      class="animate-spin mr-2 h-5 w-5 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

function getZoneName(code: string) {
  switch (code) {
    case "EU":
      return "欧服";
    case "NA":
      return "美服";
    case "PTS":
      return "测试服";
    default:
      return "未知";
  }
}

function getPlatformName(code: string) {
  switch (code) {
    case "PC":
      return "PC/Mac";
    case "XBOX":
      return "Xbox";
    case "PS4":
      return "PlayStation";
    default:
      return "未知";
  }
}

function getStatusName(online: boolean) {
  return online ? "在线" : "离线";
}

function getStatusColor(online: boolean) {
  return online ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
}
