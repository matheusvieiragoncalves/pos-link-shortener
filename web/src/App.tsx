import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HomePage } from "./screens/home";
import { NotFoundPage } from "./screens/notFound";
import { RedirectPage } from "./screens/redirect";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:shortLink" element={<RedirectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
