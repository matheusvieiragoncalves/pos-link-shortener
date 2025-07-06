import { CopyIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useLinks } from "../store/links";
import { LinkItem } from "./link-item";
import { LinkListEmpty } from "./link-list-empty";
import { Button } from "./ui/button";
import { LoadingBar } from "./ui/loading-bar";

export function LinkList() {
  const links = useLinks((store) => store.links);
  const isLoading = useLinks((store) => store.isLoading);
  const fetchLinks = useLinks((store) => store.fetchLinks);

  useEffect(() => {
    fetchLinks();
  });

  return (
    <div className="relative max-h-[100%] w-full overflow-scroll rounded-xl bg-white p-6 pb-3 shadow">
      {isLoading && <LoadingBar />}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Meus links</h3>

        <Button
          disabled
          className="flex max-w-26 flex-row gap-1.5 text-sm font-semibold"
          theme="secondary"
        >
          <CopyIcon className="h-4 w-4" />
          Baixar CSV
        </Button>
      </div>

      {!links.size ? (
        <LinkListEmpty />
      ) : (
        Array.from(links.entries()).map(([id, link]) => (
          <LinkItem key={id} {...link} />
        ))
      )}
    </div>
  );
}
