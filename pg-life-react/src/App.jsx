import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";

import Home from "./pages/Home";
import City from "./pages/City";
import PGDetail from "./pages/PGDetail";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          theme="dark"
          hideProgressBar={false}
        />

        {/* GLOBAL AUTHENTICATION MODAL */}
        <AuthModal />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city/:name" element={<City />} />
          <Route path="/pg/:id" element={<PGDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}