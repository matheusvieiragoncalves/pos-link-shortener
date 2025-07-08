import { Link } from "react-router-dom";
import NotFoundIcon from "../assets/404.svg";

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh min-w-90 items-center justify-center bg-gray-200 px-3">
      <div className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-xl bg-white px-5 py-16 shadow lg:px-12">
        <img
          src={NotFoundIcon}
          alt="not-found"
          className="h-[85px] w-[194px]"
        />

        <h2 className="text-xl font-bold text-gray-600">Link não encontrado</h2>

        <div className="text-md flex flex-col gap-1 text-center text-gray-500 lg:w-[484px]">
          <p>
            O link que você está tentando acessar não existe, foi removido ou é
            uma URL inválida.
            <Link className="text-blue-base underline" to="/">
              Saiba mais em brev.ly.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
