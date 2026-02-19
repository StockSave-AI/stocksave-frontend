import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Loader from "./components/ui/Loader";
import Home from "./components/pages/Home";
import VerifyPhone from "./components/sections/VerifyPhone";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CustomerDashboard from "./components/pages/CustomerDashboard";
import ResetPassword from "./components/ui/ResetPassword";

const About = lazy(() => import("./components/pages/About"));
const Features = lazy(() => import("./components/pages/Features"));
const Contact = lazy(() => import("./components/pages/Contact"));
const Login = lazy(() => import("./components/pages/Login"));
const Signup = lazy(() => import("./components/pages/Signup"));
const ForgetPassword = lazy(() => import("./components/pages/ForgetPassword"));

function App() {

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#16A34A",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#DC2626",
              color: "#fff",
            },
          },
        }}
      />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/verify-phone" element={<VerifyPhone />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route index element={<CustomerDashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
