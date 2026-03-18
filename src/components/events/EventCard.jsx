import { motion } from "framer-motion";
import { Heart, MapPin, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

const CATEGORY_STYLES = {
  Music:    { pill: "bg-purple-100 text-purple-700", emoji: "🎵" },
  Tech:     { pill: "bg-blue-100 text-blue-700",     emoji: "💻" },
  Sports:   { pill: "bg-green-100 text-green-700",   emoji: "⚽" },
  Food:     { pill: "bg-orange-100 text-orange-700", emoji: "🍕" },
  Art:      { pill: "bg-pink-100 text-pink-700",     emoji: "🎨" },
  Outdoors: { pill: "bg-emerald-100 text-emerald-700", emoji: "🌿" },
  Film:     { pill: "bg-red-100 text-red-700",       emoji: "🎬" },
  Health:   { pill: "bg-teal-100 text-teal-700",     emoji: "🧘" },
};

export default function EventCard({ event, isFavorited, onToggleFavorite }) {
  const style = CATEGORY_STYLES[event.category] || { pill: "bg-gray-100 text-gray-700", emoji: "📅" };

  const formattedDate = event.date
    ? format(parseISO(event.date), "EEE, MMM d, yyyy")
    : "Date TBD";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/60 transition-shadow duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {style.emoji}
          </div>
        )}

        {/* Favorite button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(event.id); }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </motion.button>

        {/* Category pill */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${style.pill}`}>
          {event.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1.5 line-clamp-1">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
            <span>{formattedDate}{event.time ? ` · ${event.time}` : ""}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}