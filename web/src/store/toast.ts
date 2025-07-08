import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IToastData {
  title: string;
  message: string;
}

type TToastState = {
  open: boolean;
  title: string;
  message: string;
  duration: number;
  show: (data: IToastData, duration?: number) => void;
  close: () => void;
};

export const useToast = create<TToastState>()(
  immer((set) => {
    function show({ title, message }: IToastData, duration = 3000) {
      set((state) => {
        state.title = title;
        state.message = message;
        state.duration = duration;
        state.open = true;
      });
    }

    function close() {
      set((state) => {
        state.open = false;
      });
    }

    return {
      open: false,
      title: "",
      message: "",
      duration: 3000,
      show,
      close,
    };
  }),
);
