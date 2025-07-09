import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastList } from "./components/ui/toast-list";
import { HomePage } from "./screens/home";
import { NotFoundPage } from "./screens/not-found";
import { RedirectPage } from "./screens/redirect";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:shortUrl" element={<RedirectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastList />
    </Router>
  );
}

export default App;
