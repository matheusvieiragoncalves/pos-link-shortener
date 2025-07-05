import { CopyIcon } from "@phosphor-icons/react";
import type { ILink } from "../@types/ILink";
import { LinkItem } from "./link-item";
import { LinkListEmpty } from "./link-list-empty";
import { Button } from "./ui/button";

export function LinkList() {
  const links: ILink[] = Array(20).fill({
    originalLink: "https://www.exemplo.com.br",
    shortLink: "brev.ly/12345",
    accessCount: 30,
  });

  return (
    <div className="rounded-xl bg-white p-6 pb-3 shadow">
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

      {!links.length ? (
        <LinkListEmpty />
      ) : (
        links.map((link, index) => <LinkItem key={index} {...link} />)
      )}
    </div>
  );
}
