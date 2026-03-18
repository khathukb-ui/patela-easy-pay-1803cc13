import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SplashScreen } from "@/components/patela/SplashScreen";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Sales from "./pages/Sales";
import Account from "./pages/Account";
import Help from "./pages/Help";
import Items from "./pages/Items";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import InstallApp from "./pages/InstallApp";
import Welcome from "./pages/Welcome";

// Onboarding
import LanguageSelection from "./pages/onboarding/LanguageSelection";
import PersonalDetails from "./pages/onboarding/PersonalDetails";
import CreatePin from "./pages/onboarding/CreatePin";
import OnboardingSuccess from "./pages/onboarding/OnboardingSuccess";

// Bank Linking
import BankLinkingStart from "./pages/bank/BankLinkingStart";
import BankCardScan from "./pages/bank/BankCardScan";
import BankManualEntry from "./pages/bank/BankManualEntry";
import BankConfirm from "./pages/bank/BankConfirm";
import BankVerify from "./pages/bank/BankVerify";
import BankUploadProof from "./pages/bank/BankUploadProof";
import BankPending from "./pages/bank/BankPending";
import BankSuccess from "./pages/bank/BankSuccess";

// Device Pairing
import DevicePairingStart from "./pages/device/DevicePairingStart";
import DeviceQRScan from "./pages/device/DeviceQRScan";
import DeviceBluetooth from "./pages/device/DeviceBluetooth";
import DeviceConfirmBluetooth from "./pages/device/DeviceConfirmBluetooth";
import DeviceFound from "./pages/device/DeviceFound";
import DeviceSuccess from "./pages/device/DeviceSuccess";
import DeviceManagement from "./pages/device/DeviceManagement";
import DeviceUnpair from "./pages/device/DeviceUnpair";
import DeviceUnpairSuccess from "./pages/device/DeviceUnpairSuccess";
import DeviceTransfer from "./pages/device/DeviceTransfer";
import DeviceUSBConnect from "./pages/device/DeviceUSBConnect";

// Settings
import UsersAccess from "./pages/settings/UsersAccess";
import PayoutPreferences from "./pages/settings/PayoutPreferences";

// Documentation
import CustomerJourneyMap from "./pages/CustomerJourneyMap";

const queryClient = new QueryClient();

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);

  useEffect(() => {
    // Check if splash was already shown this session
    const splashShown = sessionStorage.getItem("patela-splash-shown");
    if (splashShown) {
      setShowSplash(false);
      setHasShownSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasShownSplash(true);
    sessionStorage.setItem("patela-splash-shown", "true");
  };

  return (
    <>
      {showSplash && !hasShownSplash && (
        <SplashScreen onComplete={handleSplashComplete} duration={2500} />
      )}
      <BrowserRouter>
        <Routes>
          {/* Landing & Auth */}
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/install" element={<InstallApp />} />
          
          {/* Onboarding */}
          <Route path="/onboarding/language" element={<LanguageSelection />} />
          <Route path="/onboarding/details" element={<PersonalDetails />} />
          <Route path="/onboarding/pin" element={<CreatePin />} />
          <Route path="/onboarding/success" element={<OnboardingSuccess />} />
          
          {/* Bank Linking */}
          <Route path="/bank/start" element={<BankLinkingStart />} />
          <Route path="/bank/scan" element={<BankCardScan />} />
          <Route path="/bank/manual" element={<BankManualEntry />} />
          <Route path="/bank/confirm" element={<BankConfirm />} />
          <Route path="/bank/verify" element={<BankVerify />} />
          <Route path="/bank/upload" element={<BankUploadProof />} />
          <Route path="/bank/pending" element={<BankPending />} />
          <Route path="/bank/success" element={<BankSuccess />} />
          
          {/* Device Pairing */}
          <Route path="/device/start" element={<DevicePairingStart />} />
          <Route path="/device/qr" element={<DeviceQRScan />} />
          <Route path="/device/bluetooth" element={<DeviceBluetooth />} />
          <Route path="/device/confirm-bluetooth" element={<DeviceConfirmBluetooth />} />
          <Route path="/device/found" element={<DeviceFound />} />
          <Route path="/device/success" element={<DeviceSuccess />} />
          <Route path="/device/manage" element={<DeviceManagement />} />
          <Route path="/device/unpair" element={<DeviceUnpair />} />
          <Route path="/device/unpair-success" element={<DeviceUnpairSuccess />} />
          <Route path="/device/transfer" element={<DeviceTransfer />} />
          <Route path="/device/usb" element={<DeviceUSBConnect />} />
          
          {/* Settings */}
          <Route path="/settings/users" element={<UsersAccess />} />
          <Route path="/settings/payouts" element={<PayoutPreferences />} />
          
          {/* Documentation */}
          <Route path="/customer-journey" element={<CustomerJourneyMap />} />
          
          {/* Main App */}
          <Route path="/home" element={<Home />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/items" element={<Items />} />
          <Route path="/account" element={<Account />} />
          <Route path="/help" element={<Help />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
