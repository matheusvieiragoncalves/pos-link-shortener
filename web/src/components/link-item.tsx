import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import type { ILink } from "../@types/ILink";
import { Button } from "./ui/button";

type TProps = ILink;

export function LinkItem({ originalLink, shortLink, accessCount }: TProps) {
  return (
    <div className="flex flex-row items-center justify-between border-t border-t-gray-200 py-3">
      <div className="flex max-w-[157px] grow-1 flex-col gap-1">
        <h2 className="text-md text-blue-base truncate">{shortLink}</h2>
        <span className="truncate text-sm text-gray-500">{originalLink}</span>
      </div>
      <div className="align-center flex justify-center">
        <span className="text-sm text-gray-500">{accessCount} acessos</span>
      </div>
      <div className="flex flex-row items-center gap-1">
        <Button theme="secondary">
          <CopyIcon className="h-4 w-4 text-gray-600" />
        </Button>

        <Button theme="secondary">
          <TrashIcon className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
