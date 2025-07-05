import { Button } from "./ui/button";
import { InputText } from "./ui/input-text";

export function LinkForm() {
  return (
    <div className="mb-3 flex flex-col gap-5 rounded-xl bg-white p-6 shadow">
      <h2 className="m-0 text-lg font-bold text-gray-600">Novo link</h2>

      <div className="m-0 flex flex-col gap-4">
        <InputText label="Link original" placeholder="www.exemplo.com.br" />

        <InputText label="Link encurtado" placeholder="brev.ly/" />
      </div>

      <Button disabled>Salvar link</Button>
    </div>
  );
}
