import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CustomerProvider } from "./contexts/CustomerContext";

// Customer pages
import { CustomerLanding } from "./pages/customer/CustomerLanding";
import { DrinksList } from "./pages/customer/DrinksList";
import { DrinkDetail } from "./pages/customer/DrinkDetail";
import { OrderStatus } from "./pages/customer/OrderStatus";

// Bartender pages
import { BartenderLanding } from "./pages/bartender/BartenderLanding";
import { DrinkManagement } from "./pages/bartender/DrinkManagement";
import { DrinkForm } from "./pages/bartender/DrinkForm";

const App: React.FC = () => {
  return (
    <Router>
      <CustomerProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<CustomerLanding />} />
            <Route path="/menu" element={<DrinksList />} />
            <Route path="/drinks/:id" element={<DrinkDetail />} />
            <Route path="/order/status" element={<OrderStatus />} />

            {/* Bartender Routes */}
            <Route path="/admin" element={<BartenderLanding />} />
            <Route path="/admin/drinks" element={<DrinkManagement />} />
            <Route path="/admin/drinks/new" element={<DrinkForm />} />
            <Route path="/admin/drinks/edit/:id" element={<DrinkForm />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </CustomerProvider>
    </Router>
  );
};

export default App;
