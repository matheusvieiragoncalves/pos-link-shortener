import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { ILink } from "../@types/link";
import { Button } from "./ui/button";

type TProps = ILink;

export function LinkItem({ originalUrl, shortUrl, accessCount }: TProps) {
  const prefix = window.location.origin.replace(/^https?:\/\//, "");
  const path = `${prefix}/${shortUrl}`;

  return (
    <div className="flex flex-row items-center justify-between border-t border-t-gray-200 py-3">
      <div className="flex w-0 grow flex-col gap-1">
        <Link to={shortUrl} className="text-md text-blue-base truncate">
          {path}
        </Link>
        <span className="truncate text-sm text-gray-500">{originalUrl}</span>
      </div>
      <div className="align-center mx-4 flex justify-center lg:mx-5">
        <span className="text-sm whitespace-nowrap text-gray-500">
          {accessCount} acessos
        </span>
      </div>
      <div className="flex flex-row items-center gap-1">
        <Button
          theme="secondary"
          onClick={() => navigator.clipboard.writeText(shortUrl)}
        >
          <CopyIcon className="h-4 w-4 text-gray-600" />
        </Button>

        <Button theme="secondary">
          <TrashIcon className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
