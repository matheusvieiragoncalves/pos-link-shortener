import Logo from "./assets/Logo.svg";
import { LinkForm } from "./components/link-form";
import { LinkList } from "./components/link-list";

function App() {
  return (
    <div className="flex min-h-screen min-w-90 items-start justify-center bg-gray-200 pt-8">
      <div className="flex w-full max-w-sm flex-col">
        <img src={Logo} alt="brev.ly" className="mt-2 mb-6 h-6.5 self-center" />
        <LinkForm />
        <LinkList />
      </div>
    </div>
  );
}

export default App;
