import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiLogOut, FiUser, FiSettings, FiHelpCircle, FiHeadphones } from "react-icons/fi";

export default function Topbar({ onToggle }) {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarBtnRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        avatarBtnRef.current &&
        !avatarBtnRef.current.contains(e.target)
      )
        setMenuOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/40">
      <div className="flex items-center justify-between px-5 h-20">
        {/* Left: title + hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className="md:hidden p-2 text-aqua rounded-md border border-slate-700/60"
            aria-label="Open menu"
          >
            ☰
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-aqua">Account Overview</h1>
        </div>

        {/* Right: notification + customer care + avatar */}
        <div className="flex items-center gap-4">
          {/* Customer Care */}
          <button
            className="p-2 rounded-full hover:bg-slate-700 transition"
            aria-label="Customer Care"
            onClick={() => navigate("/dashboard/customer-care")}
          >
            <FiHeadphones className="w-5 h-5 text-aqua" />
          </button>

          {/* Avatar + Dropdown */}
          <div className="relative">
            <button
              ref={avatarBtnRef}
              onClick={() => setMenuOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-slate-700 transition"
            >
              <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center text-aqua font-medium">
                SB
              </div>
              <FiChevronDown className="w-4 h-4 text-aqua" />
            </button>

            {menuOpen && (
              <div
                ref={menuRef}
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 w-48 bg-slate-900 text-aqua rounded-xl shadow-xl border border-slate-700/40 overflow-hidden z-50"
              >
                <div className="py-1">
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/dashboard/profile");
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-skyblue/20 transition"
                  >
                    <FiUser className="w-4 h-4" />
                    <span className="text-sm">View Profile</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/dashboard/settings");
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-skyblue/20 transition"
                  >
                    <FiSettings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/dashboard/help");
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-skyblue/20 transition"
                  >
                    <FiHelpCircle className="w-4 h-4" />
                    <span className="text-sm">Help</span>
                  </button>

                  <div className="h-px bg-slate-700 my-1" />

                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-rose-600/30 text-rose-400 transition"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
