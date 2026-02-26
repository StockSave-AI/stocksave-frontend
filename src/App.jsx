import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DeactivateAccount from "./components/dashboard/Deactivate";
import BookingsManagement from "./components/owner/bookings/BookingsManagement";
import CashDeposit from "./components/owner/cash-deposit/CashDeposit";
import Home from "./components/pages/Home";
import VerifyPhone from "./components/sections/VerifyPhone";
import Loader from "./components/ui/Loader";
import ResetPassword from "./components/ui/ResetPassword";
import OwnerSettings from "./components/owner/owner-setting/OwnerSetting";
const WithdrawalManagement = lazy(
  () => import("./components/owner/withdrawals/WithdrawalManagement"),
);

const Redeem = lazy(() => import("./components/dashboard/redeem/Redeem"));

const PaymentPlan = lazy(
  () => import("./components/dashboard/payment-plan/PaymentPlan"),
);
const AddSavings = lazy(
  () => import("./components/dashboard/add-savings/AddSaving"),
);
const CustomerDashboard = lazy(
  () => import("./components/pages/CustomerDashboard"),
);
const BookFood = lazy(
  () => import("./components/dashboard/book-food/BookFood"),
);
const StockBoard = lazy(
  () => import("./components/dashboard/stock-board/StockBoard"),
);
const CustomerNotificationPage = lazy(
  () => import("./components/dashboard/notifications/Notification"),
);
const Settings = lazy(() => import("./components/dashboard/settings/Settings"));

const About = lazy(() => import("./components/pages/About"));
const Features = lazy(() => import("./components/pages/Features"));
const Contact = lazy(() => import("./components/pages/Contact"));
const Login = lazy(() => import("./components/pages/Login"));
const Signup = lazy(() => import("./components/pages/Signup"));
const ForgetPassword = lazy(() => import("./components/pages/ForgetPassword"));
const TermsOfService = lazy(() => import("./components/pages/TermsOfService"));
const OwnerDashboardLayout = lazy(
  () => import("./components/owner/OwnerDashboardLayout"),
);
const OwnerDashboard = lazy(() => import("./components/owner/OwnerDashboard"));
const OwnerNotification = lazy(
  () => import("./components/owner/owner-notifications/OwnerNotification"),
);
const OwnerAnalytics = lazy(
  () => import("./components/owner/analytics/OwnerAnalytics"),
);
const OwnerUsers = lazy(() => import("./components/owner/users/ViewUsers"));
const OwnerInventory = lazy(
  () => import("./components/owner/inventory/OwnerInventory"),
);

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { borderRadius: "12px", fontSize: "14px" },
          success: { style: { background: "#16A34A", color: "#fff" } },
          error: { style: { background: "#DC2626", color: "#fff" } },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/about"
          element={
            <Suspense fallback={<Loader />}>
              <About />
            </Suspense>
          }
        />

        <Route
          path="/features"
          element={
            <Suspense fallback={<Loader />}>
              <Features />
            </Suspense>
          }
        />

        <Route
          path="/contact"
          element={
            <Suspense fallback={<Loader />}>
              <Contact />
            </Suspense>
          }
        />

        <Route
          path="/login"
          element={
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          }
        />

        <Route
          path="/signup"
          element={
            <Suspense fallback={<Loader />}>
              <Signup />
            </Suspense>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<Loader />}>
              <ForgetPassword />
            </Suspense>
          }
        />

        <Route
          path="/terms"
          element={
            <Suspense fallback={<Loader />}>
              <TermsOfService />
            </Suspense>
          }
        />

        <Route path="/verify-phone" element={<VerifyPhone />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute requiredRole="customer" />}
        >
          <Route element={<DashboardLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="add-savings" element={<AddSavings />} />
            <Route path="payment-plan" element={<PaymentPlan />} />
            <Route path="book-food" element={<BookFood />} />
            <Route path="stock-board" element={<StockBoard />} />
            <Route path="redeem" element={<Redeem />} />
            <Route path="notification" element={<CustomerNotificationPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="deactivate-account" element={<DeactivateAccount />} />
          </Route>
        </Route>

        <Route path="/owner" element={<ProtectedRoute requiredRole="owner" />}>
          <Route
            element={
              <Suspense fallback={<Loader />}>
                <OwnerDashboardLayout />
              </Suspense>
            }
          >
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="cash-deposit" element={<CashDeposit />} />
            <Route path="booking" element={<BookingsManagement />} />
            <Route path="analytics" element={<OwnerAnalytics />} />
            <Route path="inventory" element={<OwnerInventory />} />
            <Route path="withdrawals" element={<WithdrawalManagement />} />
            <Route path="users" element={<OwnerUsers />} />
            <Route path="notification" element={<OwnerNotification />} />
            <Route path="setting" element={<OwnerSettings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
