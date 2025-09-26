import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import DoctorsPage from "./pages/Doctors";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/patients" element={<div>Patients</div>} />
          <Route path="/receptionists" element={<div>Receptionists</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
