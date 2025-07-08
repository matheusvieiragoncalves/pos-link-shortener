// components/GlobalToast.tsx
import { InfoIcon } from "@phosphor-icons/react";
import * as Toast from "@radix-ui/react-toast";
import { useToast } from "../../store/toast";

export function ToastGlobal() {
  const { open, message, title, duration, close } = useToast();

  return (
    <Toast.Provider swipeDirection="left" duration={duration}>
      <Toast.Root
        open={open}
        onOpenChange={close}
        className="fixed right-4 bottom-4 z-50 flex min-w-60 flex-row items-center gap-2 rounded-lg bg-red-100 px-4 py-4 shadow"
      >
        <div className="bg-danger flex h-5.5 w-5.5 items-center justify-center rounded-full">
          <InfoIcon className="h-4 w-4 text-red-100" />
        </div>
        <div className="flex flex-col gap-1">
          <Toast.Title className="text-danger text-sm font-bold">
            {title}
          </Toast.Title>
          <Toast.Description className="text-danger text-sm">
            {message}
          </Toast.Description>
        </div>
      </Toast.Root>

      <Toast.Viewport className="fixed right-4 bottom-4 z-50 flex w-96 max-w-full flex-col gap-2 outline-none" />
    </Toast.Provider>
  );
}
