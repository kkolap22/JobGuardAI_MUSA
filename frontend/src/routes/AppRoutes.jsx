import { Navigate, Route, Routes } from "react-router-dom";

import About from "../pages/About";
import AuthPage from "../pages/AuthPage";
import History from "../pages/History";
import Home from "../pages/Home";
import Report from "../pages/Report";
import Scan from "../pages/Scan";
import Protected from "./Protected";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={<AuthPage mode="login" />}
      />

      <Route
        path="/signup"
        element={<AuthPage mode="signup" />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      {/* Protected */}
      <Route
        path="/scan"
        element={
          <Protected>
            <Scan />
          </Protected>
        }
      />

      <Route
        path="/report/:scanId"
        element={
          <Protected>
            <Report />
          </Protected>
        }
      />

      <Route
        path="/history"
        element={
          <Protected>
            <History />
          </Protected>
        }
      />

      {/* Unknown route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}