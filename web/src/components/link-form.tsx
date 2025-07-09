import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { InputText } from "./ui/input-text";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod/v4";
import { useLinks } from "../store/links";

const noSpecialCharsRegex = /^[a-z0-9]+$/;

const schema = z.object({
  originalUrl: z
    .string()
    .min(1, "Campo obrigatório.")
    .url("Informe uma url válida."),
  shortUrl: z
    .string()
    .min(1, "Campo obrigatório.")
    .regex(
      noSpecialCharsRegex,
      "Informe uma url minúscula e sem espaços/caracter especial.",
    ),
});

type TFormData = z.infer<typeof schema>;

export function LinkForm() {
  const addLink = useLinks((state) => state.addLink);
  const isLoading = useLinks((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: TFormData) {
    const { created } = await addLink(data);
    if (created) reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-5 rounded-xl bg-white p-6 shadow lg:max-w-[380px]"
    >
      <h2 className="m-0 text-lg font-bold text-gray-600">Novo link</h2>

      <div className="m-0 flex flex-col gap-4">
        <InputText
          {...register("originalUrl")}
          label="Link original"
          placeholder="https://www.exemplo.com.br"
          error={errors.originalUrl?.message}
        />
        <InputText
          {...register("shortUrl")}
          label="Link encurtado"
          prefix="brev.ly/"
          error={errors.shortUrl?.message}
        />
      </div>

      <Button disabled={isLoading} type="submit">
        Salvar link
      </Button>
    </form>
  );
}
