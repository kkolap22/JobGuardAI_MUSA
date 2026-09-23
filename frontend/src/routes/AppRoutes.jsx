import { Navigate, Route, Routes } from "react-router-dom";
import Protected from "../components/common/Protected";

export default function AppRoutes({ pages }) {
  return <Routes>
    <Route path="/" element={<pages.Home />} />
    <Route path="/login" element={<pages.Login />} />
    <Route path="/signup" element={<pages.Signup />} />
    <Route path="/scan" element={<Protected><pages.Scan /></Protected>} />
    <Route path="/history" element={<Protected><pages.History /></Protected>} />
    <Route path="/about" element={<pages.About />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}