import React, { useState } from 'react';
import { Sparkles, Bot, AlertCircle, Wand2, X, FileText, PlusCircle, Globe, Play, Zap } from 'lucide-react';
import { generateProceduralCase } from '../services/groqService';
import { soundService } from '../services/soundService';

export default function CaseGeneratorModal({ isOpen, onClose, onCaseCreated }) {
  const [activeTab, setActiveTab] = useState('ai_prompt'); // 'ai_prompt', 'import_text'
  const [themePrompt, setThemePrompt] = useState('The RG Kar Hospital Investigation (Kolkata 2024)');
  const [rawDossierText, setRawDossierText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerateCase = async (specificPrompt = null) => {
    soundService.playTypewriter();
    setIsGenerating(true);
    setErrorMsg('');

    try {
      const promptToUse = specificPrompt || (activeTab === 'import_text' ? rawDossierText : themePrompt);
      const newCase = await generateProceduralCase(promptToUse);
      soundService.playClueFound();
      onCaseCreated(newCase);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to generate case. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const realWorldCasePresets = [
    { 
      title: "🏥 RG Kar Hospital Case (Kolkata 2024)", 
      tag: "CBI Forensic Dossier",
      prompt: "The August 2024 RG Kar Medical College Seminar Hall investigation with 5 suspects (civic volunteer Sanjay Roy, Principal Sandip Ghosh, Duty RMO, Security, Colleague), CCTV 04:03 timestamp, and Bluetooth earphone evidence." 
    },
    { 
      title: "🇮🇳 The Stoneman Murders (Kolkata 1989)", 
      tag: "Historical Serial Cold Case",
      prompt: "The 1989 Kolkata serial pavement murders with heavy basalt stone slabs - modeling 5 suspects, occult rituals, and Sealdah railway patrol logs." 
    },
    { 
      title: "🏠 The Burari Deaths Mystery (Delhi 2018)", 
      tag: "Psychological Autopsy",
      prompt: "The 2018 Burari 11 deaths mystery in Sant Nagar, Delhi - modeling the 11 handwritten diaries, ritual bindings, and CCTV stool ingress." 
    },
    { 
      title: "🚪 The Noida Double Murder (2008)", 
      tag: "Forensic Contradiction",
      prompt: "The 2008 Noida Aarushi & Hemraj double murder mystery with surgical scalpel evidence and forensic timeline contradictions." 
    },
    { 
      title: "🌐 1982 Chicago Tylenol Murders", 
      tag: "International Cold Case",
      prompt: "The 1982 Chicago Cyanide Tylenol tamperings with 5 suspects: James Lewis, Ted Kaczynski, Roger Arnold, Laurie Dann, Kevin Masterson." 
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-mono">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col glass-panel p-4 sm:p-6 rounded-2xl border border-cyber-cyan/50 shadow-2xl overflow-hidden bg-noir-950/95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-noir-800 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 flex-shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Real Cold Case & Mystery Architect
              </h3>
              <p className="text-[11px] text-noir-400">
                Launch authentic real criminal cold cases or generate a 5-suspect playable case from any news / FIR.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-noir-400 hover:text-white p-1 rounded-lg hover:bg-noir-900 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
          
          {/* Mode Switcher */}
          <div className="flex items-center space-x-2 bg-noir-900/90 p-1 rounded-xl border border-noir-800">
            <button
              onClick={() => setActiveTab('ai_prompt')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ai_prompt' ? 'bg-cyber-cyan text-noir-950 shadow-neon-cyan' : 'text-noir-400 hover:text-white'
              }`}
            >
              Real Case Presets & Generator
            </button>
            <button
              onClick={() => setActiveTab('import_text')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'import_text' ? 'bg-amber-500 text-noir-950 shadow-neon-amber' : 'text-noir-400 hover:text-white'
              }`}
            >
              Paste Real News / FIR Text
            </button>
          </div>

          {/* Tab 1: AI Prompt & Real Presets */}
          {activeTab === 'ai_prompt' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cyber-cyan uppercase mb-1.5">
                  Enter Any Case Name, Real Crime, or Topic:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={themePrompt}
                    onChange={(e) => setThemePrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateCase()}
                    placeholder="e.g. 'RG Kar hospital case', 'Burari mystery', 'The Stoneman Murders'..."
                    className="flex-1 bg-noir-900 text-xs text-white border border-noir-700 rounded-xl p-3 focus:outline-none focus:border-cyber-cyan font-mono shadow-inner"
                  />
                  <button
                    onClick={() => handleGenerateCase()}
                    disabled={isGenerating || !themePrompt.trim()}
                    className="px-4 py-3 bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs rounded-xl shadow-neon-cyan transition-all flex items-center space-x-1.5 flex-shrink-0 disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-amber-400 uppercase font-bold flex items-center space-x-1">
                    <span>⭐ 1-Click Famous Real-World Cold Cases:</span>
                  </span>
                  <span className="text-[9px] text-noir-500">Ready-to-play with 5 suspects & forensic clues</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {realWorldCasePresets.map((preset, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-noir-900/80 hover:bg-noir-850 border border-noir-800 hover:border-cyber-cyan/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-xs text-white group-hover:text-cyber-cyan transition-all">
                            {preset.title}
                          </h4>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-noir-950 text-amber-300 border border-noir-800">
                            {preset.tag}
                          </span>
                        </div>
                        <p className="text-[10px] text-noir-400 line-clamp-1 mt-0.5 font-mono">
                          {preset.prompt}
                        </p>
                      </div>

                      <button
                        onClick={() => handleGenerateCase(preset.prompt)}
                        disabled={isGenerating}
                        className="px-3 py-1.5 rounded-lg bg-cyber-cyan/20 hover:bg-cyber-cyan text-cyber-cyan hover:text-noir-950 border border-cyber-cyan/50 text-[11px] font-bold transition-all flex items-center space-x-1 flex-shrink-0"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play</span>
                      </button>
                    </div>
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
                placeholder="Paste raw text from a real unsolved news story or police report (e.g. 'RG Kar hospital incident notes on August 9...'). Detective-L will extract the 5 suspects, timeline, clues, and build the interactive pinboard automatically..."
                rows={6}
                className="w-full bg-noir-900 text-xs text-amber-200 border border-noir-700 rounded-xl p-3 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
              />
              <p className="text-[10px] text-noir-400">
                * The system analyzes your text, extracts timeline contradictions, and synthesizes 5 cross-examinable suspects and forensic evidence.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-blood-950/60 border border-blood-700/60 rounded-xl text-xs text-blood-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-3 pt-3 border-t border-noir-800 flex justify-end space-x-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-noir-900 hover:bg-noir-800 text-xs text-noir-300 hover:text-white border border-noir-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => handleGenerateCase()}
            disabled={isGenerating || (activeTab === 'ai_prompt' ? !themePrompt.trim() : !rawDossierText.trim())}
            className="px-5 py-2 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs shadow-neon-cyan transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Bot className="w-4 h-4 animate-spin" />
                <span>Structuring Case & 5 Suspects...</span>
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
