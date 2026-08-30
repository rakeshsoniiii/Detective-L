import React, { useState } from 'react';
import { Sparkles, Bot, AlertCircle, Wand2, X } from 'lucide-react';
import { generateProceduralCase } from '../services/groqService';
import { soundService } from '../services/soundService';

export default function CaseGeneratorModal({ isOpen, onClose, onCaseCreated }) {
  const [themePrompt, setThemePrompt] = useState('Cyberpunk Neo-Noir Hotel Poisoning in Neo-Tokyo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    soundService.playTypewriter();
    setIsGenerating(true);
    setErrorMsg('');

    try {
      const newCase = await generateProceduralCase(themePrompt);
      soundService.playClueFound();
      onCaseCreated(newCase);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to generate AI case. Please check your Groq API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const presetThemes = [
    "Victorian Steampunk Airship Murder",
    "Silicon Valley AI Supercomputer Sabotage & Death",
    "Alpine Luxury Chalet Blizzard Locked-Room Mystery",
    "Underground Poker High-Stakes Cyanide Poisoning"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-xl glass-panel p-6 rounded-2xl border border-cyber-cyan/50 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-noir-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Groq AI Unsolved Case Architect
              </h3>
              <p className="text-[11px] text-noir-400">
                Procedurally generate an intricate cold case with 5 suspects and logic-tight clues.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-noir-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Prompt */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-cyber-cyan uppercase mb-2">
              Case Theme / Setting Prompt
            </label>
            <input
              type="text"
              value={themePrompt}
              onChange={(e) => setThemePrompt(e.target.value)}
              placeholder="Describe your desired murder mystery setting..."
              className="w-full bg-noir-950 text-xs text-white border border-noir-700 rounded-xl p-3 focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] text-noir-400 uppercase block mb-1.5">Quick Inspiration Themes:</span>
            <div className="flex flex-wrap gap-1.5">
              {presetThemes.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setThemePrompt(preset)}
                  className="px-2.5 py-1 rounded-lg bg-noir-900 hover:bg-noir-850 border border-noir-800 text-[10px] text-noir-300 hover:text-white transition-all"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-blood-950/60 border border-blood-700/60 rounded-xl text-xs text-blood-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-noir-800 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-noir-800 text-xs text-noir-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !themePrompt.trim()}
            className="px-5 py-2 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs shadow-neon-cyan transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Bot className="w-4 h-4 animate-spin" />
                <span>Authoring 5 Suspects & Clues...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Mystery Case</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
