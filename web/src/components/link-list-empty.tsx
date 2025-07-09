import { LinkIcon } from "@phosphor-icons/react";

export function LinkListEmpty() {
  return (
    <div className="flex flex-col items-center border-t border-t-gray-200 py-3 text-center">
      <LinkIcon className="mb-3 h-8 w-8 text-gray-400" />
      <p className="text-xs text-gray-400 uppercase">
        Ainda não existem links cadastrados
      </p>
    </div>
  );
}
