import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { ToastGlobal } from "./components/ui/toast-global";
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
      <ToastGlobal />
    </Router>
  );
}

export default App;
