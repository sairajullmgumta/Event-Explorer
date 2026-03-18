import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Compass, Heart, Plus, Menu, X } from "lucide-react";
import SubmitEventModal from "./components/submit/SubmitEventModal";

export default function Layout({ children, currentPageName }) {
  const [showModal, setShowModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLink = (page, label, icon) => {
    const active = currentPageName === page;
    return (
      <Link
        to={createPageUrl(page)}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
          active ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-black rounded-[10px] flex items-center justify-center group-hover:bg-gray-800 transition-colors">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-[17px] tracking-tight">Event Explorer</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLink("Home", "Explore", null)}
            {navLink("Favorites", "Favorites", <Heart className="w-3.5 h-3.5" />)}
          </nav>

          <button
            onClick={() => setShowModal(true)}
            className="hidden md:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>

          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            <Link to={createPageUrl("Home")} onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Explore</Link>
            <Link to={createPageUrl("Favorites")} onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Favorites</Link>
            <button onClick={() => { setShowModal(true); setMobileOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
              + Add Event
            </button>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-gray-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
              <Compass className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Event Explorer</span>
          </div>
          <p className="text-xs text-gray-400">Discover what's happening around you</p>
        </div>
      </footer>

      <SubmitEventModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}