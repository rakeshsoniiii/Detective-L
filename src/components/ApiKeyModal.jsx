import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, Shield, X, RefreshCw } from 'lucide-react';
import { getGroqApiKey, setGroqApiKey } from '../services/groqService';
import { soundService } from '../services/soundService';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getGroqApiKey());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    soundService.playTypewriter();
    setGroqApiKey(apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-noir-700 shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-noir-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-white">
                Groq API Configuration
              </h3>
              <p className="text-[10px] text-noir-400">
                Powers real-time 5-suspect interrogation and L-Copilot.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-noir-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-bold text-amber-400 uppercase">
            Groq API Key (gsk_...)
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="gsk_..."
            className="w-full bg-noir-950 text-xs text-white border border-noir-700 rounded-xl p-3 focus:outline-none focus:border-amber-500"
          />
          <p className="text-[10px] text-noir-400">
            Stored locally in your browser and used securely to communicate with Groq LLaMA-3.3 LLM.
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-noir-800 text-xs text-noir-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-noir-950 font-bold text-xs transition-all flex items-center space-x-1.5"
          >
            {saved ? <CheckCircle className="w-3.5 h-3.5" /> : null}
            <span>{saved ? 'Key Saved!' : 'Save Key'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
