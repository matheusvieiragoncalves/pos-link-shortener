// components/GlobalToast.tsx
import { InfoIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useToast, type IToast } from "../../store/toast";

type TProps = IToast & {
  id: string;
};

export function Toast({ id, message, title, duration, type }: TProps) {
  const removeToast = useToast((state) => state.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, removeToast]);

  return (
    <button
      onClick={() => removeToast(id)}
      data-type={type}
      className="group animate-toast-in flex w-80 cursor-pointer flex-row items-center gap-2 rounded-lg px-4 py-4 shadow data-[type=error]:bg-red-100 data-[type=info]:bg-blue-100 data-[type=success]:bg-green-100"
    >
      <div className="group-data-[type=error]:bg-danger group-data-[type=info]:bg-blue-dark flex h-5.5 w-5.5 items-center justify-center rounded-full group-data-[type=success]:bg-green-800">
        <InfoIcon className="h-4 w-4 group-data-[type=error]:text-red-100 group-data-[type=info]:text-blue-100 group-data-[type=success]:text-green-100" />
      </div>
      <div className="flex flex-col items-start gap-1 text-start">
        <h6 className="group-data-[type=error]:text-danger group-data-[type=info]:text-blue-dark text-sm font-bold group-data-[type=success]:text-green-800">
          {title}
        </h6>
        <p className="group-data-[type=error]:text-danger group-data-[type=info]:text-blue-dark text-sm group-data-[type=success]:text-green-800">
          {message}
        </p>
      </div>
    </button>
  );
}
