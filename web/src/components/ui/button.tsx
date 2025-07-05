import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "cursor-pointer w-full text-md disabled:opacity-50",

  variants: {
    theme: {
      primary:
        "text-white bg-blue-base rounded-lg py-[15px] hover:bg-blue-dark",
      secondary:
        "hover:border-blue-dark rounded-sm bg-gray-200 p-[8px] font-semibold text-gray-500 hover:border",
    },
  },

  defaultVariants: {
    theme: "primary",
  },
});

type TButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({ theme, className, ...props }: TButtonProps) {
  return (
    <button
      className={buttonVariants({ theme, className })}
      {...props}
    ></button>
  );
}
