import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./components/pages/LandingPage";
import Dashboard from "./components/pages/Dashboard";
import Transfer from "./components/pages/Transfer";
import BuyAirtime from "./components/pages/BuyAirtime";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import CustomerCare from "./components/pages/CustomerCare";
import CardService from "./components/pages/CardService";
import Transactions from "./components/pages/Transactions";
import Help from "./components/pages/Help";
import Profile from "./components/pages/Profile";
import Settings from "./components/pages/Settings";

// App component: Defines the routing structure of the application
const App = () => {
  return (
    // BrowserRouter: Provides routing context to the app
    <BrowserRouter>

      <Routes>
        {/* Public route for the landing page, no layout wrapper */}
        <Route path="/" element={<LandingPage />} />

        {/* Nested routes for dashboard pages, wrapped in MainLayout for sidebar and topbar */}
        <Route path="/dashboard/*" element={<MainLayout />}>
          
          {/* Default dashboard route renders the Dashboard component */}
          <Route index element={<Dashboard />} />

          {/* Subroutes for various dashboard functionalities */}
          <Route path="transfer" element={<Transfer />} />
          <Route path="airtime" element={<BuyAirtime />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="customer-care" element={<CustomerCare />} />
          <Route path="card-service" element={<CardService />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="help" element={<Help />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
