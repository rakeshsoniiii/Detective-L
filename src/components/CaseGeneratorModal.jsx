import React, { useState } from 'react';
import { Sparkles, Bot, AlertCircle, Wand2, X, FileText, PlusCircle, Globe } from 'lucide-react';
import { generateProceduralCase } from '../services/groqService';
import { soundService } from '../services/soundService';

export default function CaseGeneratorModal({ isOpen, onClose, onCaseCreated }) {
  const [activeTab, setActiveTab] = useState('ai_prompt'); // 'ai_prompt', 'import_text', 'manual'
  const [themePrompt, setThemePrompt] = useState('Real Indian Cold Case: The Mysterious Pavement Attacks in Old Delhi');
  const [rawDossierText, setRawDossierText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerateFromPrompt = async () => {
    soundService.playTypewriter();
    setIsGenerating(true);
    setErrorMsg('');

    try {
      const promptToUse = activeTab === 'import_text' 
        ? `REAL CRIME DOSSIER TEXT TO PARSE INTO 5 SUSPECTS AND EVIDENCE:\n${rawDossierText}`
        : themePrompt;

      const newCase = await generateProceduralCase(promptToUse);
      soundService.playClueFound();
      onCaseCreated(newCase);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to generate AI case. Please verify your API key in Settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  const realWorldCasePresets = [
    { title: "🇮🇳 The Burari Family Mystery (Delhi)", prompt: "The 2018 Burari 11 deaths mystery in Sant Nagar, Delhi - modeling the 5 prime family acquaintances, occult beliefs, and diaries." },
    { title: "🇮🇳 The Stoneman Murders (Mumbai/Kolkata)", prompt: "The 1985 Mumbai King's Circle serial pavement murders with 5 distinct investigative suspect theories." },
    { title: "🌐 1982 Chicago Tylenol Murders", prompt: "The 1982 Chicago Cyanide Tylenol tamperings with 5 suspects: James Lewis, Ted Kaczynski, Roger Arnold, Laurie Dann, Kevin Masterson." },
    { title: "🌐 The Black Dahlia (1947 LA)", prompt: "The 1947 Elizabeth Short murder with Dr. George Hodel, Leslie Dillon, Walter Bayley, Mark Hansen, and Jack Anderson Wilson." }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col glass-panel p-4 sm:p-6 rounded-2xl border border-cyber-cyan/50 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-noir-800 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyber-cyan/20 text-cyber-cyan flex-shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Real Cold Case & Mystery Architect
              </h3>
              <p className="text-[11px] text-noir-400">
                Transform real Indian / international crime stories or custom mysteries into a 5-suspect playable case.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-noir-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-2 mb-4 bg-noir-950 p-1 rounded-xl border border-noir-800">
            <button
              onClick={() => setActiveTab('ai_prompt')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ai_prompt' ? 'bg-cyber-cyan text-noir-950 shadow-neon-cyan' : 'text-noir-400 hover:text-white'
              }`}
            >
              AI Cold Case Generator
            </button>
            <button
              onClick={() => setActiveTab('import_text')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'import_text' ? 'bg-amber-500 text-noir-950 shadow-neon-amber' : 'text-noir-400 hover:text-white'
              }`}
            >
              Import Real News / FIR Text
            </button>
          </div>

          {/* Tab 1: AI Prompt & Real Presets */}
          {activeTab === 'ai_prompt' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cyber-cyan uppercase mb-2">
                  Case Theme or Real Cold Case Description:
                </label>
                <input
                  type="text"
                  value={themePrompt}
                  onChange={(e) => setThemePrompt(e.target.value)}
                  placeholder="Describe any real or fictional case..."
                  className="w-full bg-noir-950 text-xs text-white border border-noir-700 rounded-xl p-3 focus:outline-none focus:border-cyber-cyan font-mono"
                />
              </div>

              <div>
                <span className="text-[10px] text-amber-400 uppercase block mb-1.5 font-bold">
                  ⭐ Famous Real-World Unsolved Cases Presets:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {realWorldCasePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setThemePrompt(preset.prompt)}
                      className="p-2.5 rounded-lg bg-noir-900 hover:bg-noir-850 border border-noir-800 text-left text-xs text-noir-200 hover:text-amber-300 transition-all flex flex-col justify-between"
                    >
                      <span className="font-bold">{preset.title}</span>
                      <span className="text-[10px] text-noir-400 truncate mt-1">{preset.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Import Real Dossier / FIR Text */}
          {activeTab === 'import_text' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-amber-400 uppercase">
                Paste Real Crime News Article, Police FIR, or Investigation Notes:
              </label>
              <textarea
                value={rawDossierText}
                onChange={(e) => setRawDossierText(e.target.value)}
                placeholder="Paste raw text from a real unsolved news story or police report. Detective AI will extract the 5 suspects, timeline, clues, and build the interactive pinboard automatically..."
                rows={6}
                className="w-full bg-noir-950 text-xs text-amber-200 border border-noir-700 rounded-xl p-3 focus:outline-none focus:border-amber-500 font-mono"
              />
              <p className="text-[10px] text-noir-400">
                * Detective-L will analyze the text and synthesize 5 cross-examinable suspects and forensic clues.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="mt-3 p-3 bg-blood-950/60 border border-blood-700/60 rounded-xl text-xs text-blood-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-noir-800 flex justify-end space-x-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-noir-800 text-xs text-noir-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateFromPrompt}
            disabled={isGenerating || (activeTab === 'ai_prompt' ? !themePrompt.trim() : !rawDossierText.trim())}
            className="px-5 py-2 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs shadow-neon-cyan transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Bot className="w-4 h-4 animate-spin" />
                <span>Extracting 5 Suspects & Structuring Case...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Build & Launch Playable Case</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
