import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from '@getmocha/users-service/react';
import HomePage from "@/react-app/pages/Home";
import ApplyPage from "@/react-app/pages/Apply";
import AdminPage from "@/react-app/pages/Admin";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";

import Header from "@/react-app/components/Header";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/admin" element={<AdminPage />} />
            
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
