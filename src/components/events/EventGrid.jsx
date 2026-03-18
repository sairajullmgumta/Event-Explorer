import { motion, AnimatePresence } from "framer-motion";
import EventCard from "./EventCard";
import { CalendarX } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-100 rounded-lg w-full" />
        <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
        <div className="pt-2 space-y-2">
          <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
          <div className="h-3 bg-gray-100 rounded-lg w-2/5" />
        </div>
      </div>
    </div>
  );
}

export default function EventGrid({ events, favorites, onToggleFavorite, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CalendarX className="w-7 h-7 text-gray-300" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">No events found</h3>
        <p className="text-gray-400 text-sm">Try a different search or category</p>
      </div>
    );
  }

  return (
    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <motion.div
            key={event.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <EventCard
              event={event}
              isFavorited={favorites.includes(event.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}