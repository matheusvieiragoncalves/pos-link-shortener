import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface IToast {
  title: string;
  message: string;
  type?: "info" | "success" | "error";
  duration?: number;
}

type TToastState = {
  toasts: Map<string, IToast>;
  addToast: (toast: IToast) => void;
  removeToast: (toastId: string) => void;
};

export const useToast = create<TToastState>()(
  immer((set, get) => {
    function addToast({
      title,
      message,
      duration = 3000,
      type = "info",
    }: IToast) {
      set((state) => {
        state.toasts.set(Date.now().toString(), {
          title,
          message,
          duration,
          type,
        });
      });
    }

    function removeToast(toastId: string) {
      const toast = get().toasts.get(toastId);

      if (!toast) return;

      set((state) => {
        state.toasts.delete(toastId);
      });
    }

    return {
      toasts: new Map(),
      addToast,
      removeToast,
    };
  }),
);
