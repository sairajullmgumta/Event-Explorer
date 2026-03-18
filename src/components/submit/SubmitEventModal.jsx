import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = ["Music", "Tech", "Sports", "Food", "Art", "Outdoors", "Film", "Health"];

const EMPTY_FORM = {
  title: "", description: "", category: "",
  date: "", time: "", location: "", image_url: "",
};

function Field({ label, optional, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{" "}
        {optional && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all bg-white placeholder:text-gray-400";

export default function SubmitEventModal({ isOpen, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.Event.create(form);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setForm(EMPTY_FORM);
      onClose();
    }, 1800);
  };

  const handleClose = () => {
    if (!loading) {
      setForm(EMPTY_FORM);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 px-8 gap-4"
              >
                <CheckCircle2 className="w-14 h-14 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-900">Event submitted!</h3>
                <p className="text-gray-500 text-sm text-center">Your event has been added to the explorer.</p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Add New Event</h2>
                  <button
                    onClick={handleClose}
                    className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                  <Field label="Title">
                    <input
                      required
                      value={form.title}
                      onChange={(e) => update("title", e.target.value)}
                      placeholder="e.g. SF Jazz Festival"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Description" optional>
                    <textarea
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="What's this event about?"
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Category">
                      <select
                        required
                        value={form.category}
                        onChange={(e) => update("category", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select...</option>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Date">
                      <input
                        required
                        type="date"
                        value={form.date}
                        onChange={(e) => update("date", e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Time" optional>
                      <input
                        type="time"
                        value={form.time}
                        onChange={(e) => update("time", e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Location">
                      <input
                        required
                        value={form.location}
                        onChange={(e) => update("location", e.target.value)}
                        placeholder="City, Venue"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Cover Image URL" optional>
                    <input
                      type="url"
                      value={form.image_url}
                      onChange={(e) => update("image_url", e.target.value)}
                      placeholder="https://..."
                      className={inputClass}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                    ) : (
                      "Submit Event"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}