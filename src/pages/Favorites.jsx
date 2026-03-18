import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import EventGrid from "../components/events/EventGrid";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const FAVORITES_KEY = "event_explorer_favorites";

export default function Favorites() {
  const queryClient = useQueryClient();
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

  const favoritedEvents = events.filter((e) => favorites.includes(e.id));

  const isEmpty = !isLoading && favorites.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Favorites</h1>
        </div>
        <p className="text-gray-500">Events you've saved for later</p>
      </motion.div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-24"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-gray-300" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">No favorites yet</h3>
          <p className="text-gray-400 text-sm mb-6">Tap the heart on any event to save it here</p>
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Browse Events
          </Link>
        </motion.div>
      ) : (
        <EventGrid
          events={favoritedEvents}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          loading={isLoading}
        />
      )}
    </div>
  );
}