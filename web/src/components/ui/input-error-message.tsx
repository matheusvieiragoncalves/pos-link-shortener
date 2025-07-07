import { WarningIcon } from "@phosphor-icons/react";

interface IInputErrorMessageProps {
  error: string;
}

export function InputErrorMessage({ error }: IInputErrorMessageProps) {
  return (
    <div className="flex flex-row items-center gap-1">
      <WarningIcon className="text-danger h-4 w-4" />
      <span className="text-xs text-gray-500">{error}</span>
    </div>
  );
}
