// components/GlobalToast.tsx

import { useToast } from "../../store/toast";
import { Toast } from "./toast";

export function ToastList() {
  const toasts = useToast((state) => state.toasts);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {Array.from(toasts.entries()).map(([id, toast]) => (
        <Toast key={id} id={id} {...toast} />
      ))}
    </div>
  );
}
