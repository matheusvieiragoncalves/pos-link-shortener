import { Link } from "react-router-dom";
import LogoIcon from "../assets/Logo_Icon.svg";

export function RedirectPage() {
  return (
    <div className="flex min-h-dvh min-w-90 items-center justify-center bg-gray-200 px-3">
      <div className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-xl bg-white px-5 py-16 shadow lg:px-12">
        <img src={LogoIcon} alt="brev.ly" className="h-[48px] w-[48px]" />

        <h2 className="text-xl font-bold text-gray-600">Redirecionando...</h2>

        <div className="text-md flex flex-col gap-1 text-center text-gray-500 lg:w-[484px]">
          <p>O link será aberto automaticamente em alguns instantes. </p>
          <p>
            Não foi redirecionado?
            <Link className="text-blue-base underline" to="/">
              Acesse aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
