import Logo from "./assets/Logo.svg";
import { LinkForm } from "./components/link-form";
import { LinkList } from "./components/link-list";

function App() {
  return (
    <div className="flex min-w-90 items-start justify-center bg-gray-200 px-3 pt-8">
      <div className="flex w-full max-w-[980px] flex-col">
        <div className="flex w-full justify-center md:justify-start">
          <img src={Logo} alt="brev.ly" className="mt-2 mb-6 h-6.5" />
        </div>
        <div className="flex w-full flex-col items-start gap-3 md:flex-row">
          <LinkForm />
          <LinkList />
        </div>
      </div>
    </div>
  );
}

export default App;
