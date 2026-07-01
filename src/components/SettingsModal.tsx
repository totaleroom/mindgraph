import { useState } from "react";
import { motion } from "motion/react";
import { KeyRound, X } from "lucide-react";
import type { Settings } from "../types";

interface Props {
  settings: Settings;
  onSave: (patch: Partial<Settings>) => void;
  onClearAll: () => void;
  onClose: () => void;
}

const MODELS = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];

export function SettingsModal({ settings, onSave, onClearAll, onClose }: Props) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [confirmClear, setConfirmClear] = useState(false);

  const save = () => {
    onSave({ apiKey: apiKey.trim(), model });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="bg-surface border-2 border-primary hard-shadow-lg w-full max-w-md max-h-[90dvh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        <div className="flex items-center justify-between border-b-2 border-primary p-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5" />
            <h2 className="font-epilogue text-xl font-bold">Settings</h2>
          </div>
          <button type="button" aria-label="Close settings" onClick={onClose} className="p-1 border-2 border-primary bg-surface lift-interaction">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="api-key" className="font-epilogue font-bold text-sm">
              Gemini API key <span className="text-secondary font-manrope font-normal">(Bring Your Own Key)</span>
            </label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza…"
              className="bg-surface-container-low border-2 border-primary px-3 py-2 font-manrope text-sm outline-none focus:hard-shadow-sm"
            />
            <p className="font-manrope text-xs text-secondary">
              Stored only in this browser (localStorage). Never sent anywhere except Google's API.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="model" className="font-epilogue font-bold text-sm">Model</label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-surface-container-low border-2 border-primary px-3 py-2 font-manrope text-sm outline-none"
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="border-t-2 border-primary pt-4">
            {confirmClear ? (
              <div className="flex flex-col gap-2">
                <p className="font-manrope text-sm">Delete all thoughts permanently?</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setConfirmClear(false)} className="flex-1 border-2 border-primary px-3 py-2 font-epilogue font-bold text-sm lift-interaction">Cancel</button>
                  <button type="button" onClick={() => { onClearAll(); setConfirmClear(false); }} className="flex-1 bg-accent-pink border-2 border-primary px-3 py-2 font-epilogue font-bold text-sm lift-interaction">Delete all</button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmClear(true)} className="font-manrope text-sm text-secondary underline">
                Clear all thoughts…
              </button>
            )}
          </div>
        </div>

        <div className="border-t-2 border-primary p-4 flex justify-end">
          <button type="button" onClick={save} className="bg-primary text-on-primary font-epilogue font-bold px-5 py-2.5 border-2 border-primary hard-shadow-sm lift-interaction">
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
