import { Button } from "./components/ui/button";
import { InputText } from "./components/ui/input-text";

import { CopyIcon } from "@phosphor-icons/react";
import Logo from "./assets/Logo.svg";

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <img src={Logo} alt="brev.ly" className="h-10" />
        </div>

        <div className="space-y-4 rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-bold text-gray-600">Novo link</h2>

          <div className="space-y-1">
            <InputText label="Link original" placeholder="www.exemplo.com.br" />
          </div>

          <div className="space-y-1">
            <InputText label="Link encurtado" placeholder="brev.ly/" />
          </div>

          <Button>Salvar link</Button>
        </div>

        {/* Meus Links */}
        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Meus links</h3>

            <Button
              className="flex max-w-25 flex-row gap-1.5 text-sm font-semibold"
              theme="secondary"
            >
              <CopyIcon className="h-4 w-4" />
              Baixar CSV
            </Button>
          </div>

          <div className="flex flex-col items-center text-center text-sm text-gray-500">
            <svg
              className="mb-2 h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.59 14.37a5 5 0 01-7.07 0l-1.41-1.41a5 5 0 017.07-7.07l1.41 1.41a5 5 0 010 7.07z"
              />
            </svg>
            Ainda não existem links cadastrados
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
