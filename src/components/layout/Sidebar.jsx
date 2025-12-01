import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiRepeat,
  FiCreditCard,
  FiLogOut,
  FiShield,
  FiPhone,
  FiFileText,
  FiSmartphone,
  FiUser,
  FiSettings,
} from "react-icons/fi";

export default function Sidebar({ onClose = () => { } }) {
  
  // Array of navigation items with name, route, and icon for the sidebar menu
  const navItems = [
    { name: "Dashboard", to: "/dashboard", icon: <FiHome /> },
    { name: "Transfer", to: "/dashboard/transfer", icon: <FiRepeat /> },
    { name: "Buy Airtime", to: "/dashboard/airtime", icon: <FiSmartphone /> },
    { name: "Transactions", to: "/dashboard/transactions", icon: <FiCreditCard /> },
    { name: "Profile", to: "/dashboard/profile", icon: <FiUser /> },
    { name: "Card Services", to: "/dashboard/card-service", icon: <FiCreditCard /> },
    { name: "Settings", to: "/dashboard/settings", icon: <FiSettings /> },
    { name: "Privacy Policy", to: "/dashboard/privacy-policy", icon: <FiShield /> },
    { name: "Customer Care", to: "/dashboard/customer-care", icon: <FiPhone /> },
    { name: "Help", to: "/dashboard/help", icon: <FiFileText /> },
    { name: "Logout", to: "/", icon: <FiLogOut /> },
  ];

  return (
    // Sidebar container with full height, flex layout, and styling for backdrop blur and rounded corners
    <aside className="h-full flex flex-col bg-slate-800/80 backdrop-blur-md text-aqua rounded-2xl p-4 shadow-2xl">
      {/* Brand section at the top of the sidebar */}
      <div className="mb-6">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 flex flex-col items-center justify-center shadow-lg border border-slate-800/90">
          {/* Logo circle with initials */}
          <div className="w-12 h-12 rounded-full bg-skyblue flex items-center justify-center font-bold text-black text-lg mb-2">
            SB
          </div>
          {/* Brand name and tagline */}
          <div className="text-aqua font-bold text-lg text-center">SkyBank</div>
          <div className="text-slate-300 text-xs text-center">Banking made easy</div>
        </div>
      </div>

      {/* Navigation section with scrollable menu */}
      <nav className="flex-1 overflow-auto scrollbar-hide">
        <ul className="space-y-2">
          {/* Map over navItems to render each navigation link */}
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                end
                // Dynamic className based on active state for styling
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-skyblue/20 to-aqua/20 text-white border-l-4 border-aqua shadow-md"
                      : "text-aqua/80 hover:bg-skyblue/10 hover:text-white"
                  }`
                }
                onClick={onClose} // Close sidebar on mobile when link is clicked
              >
                {/* Icon and text for each nav item */}
                <span className="w-5 h-5">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
