import { Route, Routes } from "react-router-dom";
import SiteLayout from "./components/layout/SiteLayout.jsx";
import DoneDealsPage from "./pages/DoneDealsPage.jsx";
import HomePage from "./pages/HomePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/done-deals" element={<DoneDealsPage />} />
      </Route>
    </Routes>
  );
}
