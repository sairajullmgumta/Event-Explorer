import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";
import EventGrid from "../components/events/EventGrid";
import CategoryFilter from "../components/filters/CategoryFilter";
import SearchBar from "../components/filters/SearchBar";

const FAVORITES_KEY = "event_explorer_favorites";

export default function Home() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); }
    catch { return []; }
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => base44.entities.Event.list("-created_date", 100),
  });

  useEffect(() => {
    const unsubscribe = base44.entities.Event.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    });
    return unsubscribe;
  }, [queryClient]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const filtered = events.filter((e) => {
    const s = search.toLowerCase();
    const matchSearch =
      !search ||
      e.title?.toLowerCase().includes(s) ||
      e.location?.toLowerCase().includes(s) ||
      e.description?.toLowerCase().includes(s);
    const matchCategory = !category || e.category === category;
    const matchFavorites = !showFavoritesOnly || favorites.includes(e.id);
    return matchSearch && matchCategory && matchFavorites;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-3">
          Discover Events
        </h1>
        <p className="text-gray-500 text-lg">Find what's happening around you</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-3 mb-8"
      >
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowFavoritesOnly((v) => !v)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium border transition-all whitespace-nowrap ${
              showFavoritesOnly
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800"
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-red-500 text-red-500" : ""}`} />
            <span className="hidden sm:inline">Favorites</span>
            {favorites.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${showFavoritesOnly ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                {favorites.length}
              </span>
            )}
          </motion.button>
        </div>
        <CategoryFilter selected={category} onChange={setCategory} />
      </motion.div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-gray-400 mb-5">
          {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          {category ? ` in ${category}` : ""}
          {search ? ` matching "${search}"` : ""}
        </p>
      )}

      <EventGrid
        events={filtered}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        loading={isLoading}
      />
    </div>
  );
}