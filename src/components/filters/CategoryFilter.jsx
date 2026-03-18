import { motion } from "framer-motion";

const CATEGORIES = [
  { label: "All",        emoji: "✨" },
  { label: "Music",      emoji: "🎵" },
  { label: "Tech",       emoji: "💻" },
  { label: "Sports",     emoji: "⚽" },
  { label: "Art",        emoji: "🎨" },
  { label: "Networking", emoji: "🤝" },
  { label: "Food",       emoji: "🍕" },
  { label: "Outdoors",   emoji: "🌿" },
  { label: "Film",       emoji: "🎬" },
  { label: "Health",     emoji: "🧘" },
];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
      {CATEGORIES.map(({ label, emoji }) => {
        const isActive = label === "All" ? !selected : selected === label;
        return (
          <motion.button
            key={label}
            whileTap={{ scale: 0.93 }}
            onClick={() => onChange(label === "All" ? "" : label)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
              isActive
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
            }`}
          >
            <span className="text-base leading-none">{emoji}</span>
            <span>{label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}