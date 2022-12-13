import { useState, useEffect } from "preact/hooks";
import { Fragment } from "preact";
import { Dialog, Transition } from "@headlessui/react";
import { CDN_URL } from "@/consts";

/** [id, map_id, map_name, name, type, x, y] */
type Item = [string, number, string, string, number, number, number];

let data: Item[] = [];

async function initSearch() {
  const response = await fetch(`${CDN_URL}/maps/search.json`);
  data = await response.json();
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        openModal();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handle = requestIdleCallback(initSearch);
    return () => {
      cancelIdleCallback(handle);
    };
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        class="flex flex-1 w-full items-center text-sm leading-6 text-slate-400 rounded-md ring-1 ring-slate-900/10 shadow-sm py-1.5 pl-2 pr-3 bg-slate-800 highlight-white/5 hover:bg-slate-700"
        onClick={openModal}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          aria-hidden="true"
          class="mr-3 flex-none"
        >
          <path
            d="m19 19-3.5-3.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <circle
            cx="11"
            cy="11"
            r="6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></circle>
        </svg>
        搜索地点
        <span class="ml-auto pl-3 flex-none text-xs font-semibold">
          Ctrl + K
        </span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg text-left align-middle transition-all">
                  <input
                    class="block w-full appearance-none bg-white py-4 pl-4 pr-12 text-base text-slate-900 placeholder:text-slate-600 focus:outline-none sm:text-sm sm:leading-6"
                    placeholder="搜索地点"
                    onChange={(e) =>
                      setSearch((e!.target as HTMLInputElement).value)
                    }
                    type="search"
                  />
                  <svg
                    class="pointer-events-none absolute top-4 right-4 h-6 w-6 fill-slate-400"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.47 21.53a.75.75 0 1 0 1.06-1.06l-1.06 1.06Zm-9.97-4.28a6.75 6.75 0 0 1-6.75-6.75h-1.5a8.25 8.25 0 0 0 8.25 8.25v-1.5ZM3.75 10.5a6.75 6.75 0 0 1 6.75-6.75v-1.5a8.25 8.25 0 0 0-8.25 8.25h1.5Zm6.75-6.75a6.75 6.75 0 0 1 6.75 6.75h1.5a8.25 8.25 0 0 0-8.25-8.25v1.5Zm11.03 16.72-5.196-5.197-1.061 1.06 5.197 5.197 1.06-1.06Zm-4.28-9.97c0 1.864-.755 3.55-1.977 4.773l1.06 1.06A8.226 8.226 0 0 0 18.75 10.5h-1.5Zm-1.977 4.773A6.727 6.727 0 0 1 10.5 17.25v1.5a8.226 8.226 0 0 0 5.834-2.416l-1.061-1.061Z"></path>
                  </svg>
                  <ul
                    class="max-h-[18.375rem] min-h-[60vh] vi divide-y bg-white divide-slate-200 overflow-y-auto rounded-b-lg border-t border-slate-200 text-sm leading-6"
                    role="listbox"
                  >
                    {search.length >= 2 &&
                      data
                        .filter((x) => x[3].includes(search))
                        .map((x) => (
                          <li
                            class="flex items-center justify-between px-4 py-2 hover:bg-slate-50"
                            role="option"
                          >
                            <a href={`/map/${x[1]}?poi=${x[0]}`}>
                              <span class="whitespace-nowrap font-semibold text-slate-900">
                                {x[3]}
                              </span>
                              <span class="ml-4 text-right text-xs text-slate-600">
                                {x[2]}
                              </span>
                            </a>
                          </li>
                        ))}
                  </ul>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
