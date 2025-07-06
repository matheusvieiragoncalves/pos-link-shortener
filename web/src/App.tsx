import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HomePage } from "./screens/home";
import { RedirectPage } from "./screens/redirect";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:shortLink" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
