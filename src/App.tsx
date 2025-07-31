import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import TicketTracker from "./components/TicketTracker";
import AdminLoginPage from "./components/auth/AdminLoginPage";
import CallCentreLoginPage from "./components/auth/CallCentreLoginPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import AdminDashboard from "./pages/admin/dashboard";
import CallCentreDashboard from "./pages/callcentre/dashboard";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/track-ticket" element={<TicketTracker />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/callcentre/login" element={<CallCentreLoginPage />} />
          <Route
            path="/admin/forgot-password"
            element={<ForgotPasswordPage userType="admin" />}
          />
          <Route
            path="/callcentre/forgot-password"
            element={<ForgotPasswordPage userType="callcentre" />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/callcentre/dashboard"
            element={<CallCentreDashboard />}
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
