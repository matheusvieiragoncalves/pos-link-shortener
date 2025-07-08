import { type ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { InputErrorMessage } from "./input-error-message";

const inputWrapperVariants = tv({
  base: "flex w-full flex-row items-center rounded-md border border-gray-300 px-[16px] text-gray-600",

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
  VariantProps<typeof inputWrapperVariants> & {
    label: string;
    error?: string;
    prefix?: string;
  };

export function InputText({
  status,
  label,
  error,
  prefix,
  ...props
}: TButtonProps) {
  return (
    <label className="flex flex-col gap-[6px]">
      <span className={labelVariants({ status })}>{label}</span>

      <div className={inputWrapperVariants({ status })}>
        {prefix && <span className="text-md text-gray-400">{prefix}</span>}
        <input
          type="text"
          className="placeholder:text-md h-full w-full py-[12px] outline-none placeholder:text-gray-400"
          {...props}
        ></input>
      </div>

      {error && <InputErrorMessage error={error} />}
    </label>
  );
}
