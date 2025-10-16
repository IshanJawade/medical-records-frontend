import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import DoctorsPage from "./pages/Doctors";
import ReceptionsPage from "./pages/Receptions";
import PatientsPage from "./pages/Patients";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/receptions" element={<ReceptionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
