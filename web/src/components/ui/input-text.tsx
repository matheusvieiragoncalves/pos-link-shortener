import { type ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { InputErrorMessage } from "./input-error-message";

const inputVariants = tv({
  base: "placeholder:text-md w-full rounded-md border border-gray-300 px-[16px] py-[12px] text-gray-600 outline-none placeholder:text-gray-400",

  variants: {
    status: {
      active: "border-blue-base border-[1.5px]",
      error: "border-danger border-[1.5px]",
    },
  },
});

const labelVariants = tv({
  base: "text-xs uppercase font-light text-gray-500",
  variants: {
    status: {
      active: "text-blue-base font-bold",
      error: "text-danger font-bold",
    },
  },
});

type TButtonProps = ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    label: string;
    error?: string;
  };

export function InputText({ status, label, error, ...props }: TButtonProps) {
  return (
    <label className="flex flex-col gap-[6px]">
      <span className={labelVariants({ status })}>{label}</span>

      <input
        type="text"
        className={inputVariants({ status })}
        {...props}
      ></input>

      {error && <InputErrorMessage error={error} />}
    </label>
  );
}
