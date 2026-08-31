import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  Fingerprint, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  Lock, 
  Search, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { soundService } from '../services/soundService';

export default function EvidenceLocker({ activeCase, onDiscoverClue }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedClue, setSelectedClue] = useState(null);
  const [viewMode, setViewMode] = useState('clues'); // 'clues' or 'timeline'

  const categories = [
    { id: 'all', label: 'All Evidence' },
    { id: 'forensic', label: 'Forensics & Autopsy' },
    { id: 'digital', label: 'Digital & Cyber' },
    { id: 'physical', label: 'Physical Items' },
  ];

  const filteredClues = activeCase.clues.filter(c => {
    if (activeCategory === 'all') return true;
    return c.category === activeCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 h-full flex-1 min-h-0 flex flex-col gap-3 overflow-hidden font-mono">
      
      {/* Top Dossier Header */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-noir-800 flex flex-wrap items-center justify-between gap-2 sm:gap-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-blood-600/10 text-blood-500 border border-blood-500/30 flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-bold font-display text-white">
                Official Case File: {activeCase.title}
              </h2>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                {activeCase.difficulty}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-noir-400 mt-0.5">
              Victim: <strong className="text-white">{activeCase.victim}</strong> • TOD: <strong className="text-amber-300">{activeCase.timeOfDeath}</strong>
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-1 bg-noir-900 p-1 rounded-xl border border-noir-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { soundService.playTypewriter(); setViewMode('clues'); }}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              viewMode === 'clues' ? 'bg-blood-600 text-white shadow-neon-red' : 'text-noir-400 hover:text-white'
            }`}
          >
            Clue Locker ({activeCase.clues.filter(c => c.discovered).length}/{activeCase.clues.length})
          </button>
          <button
            onClick={() => { soundService.playTypewriter(); setViewMode('timeline'); }}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              viewMode === 'timeline' ? 'bg-amber-600 text-noir-950 shadow-neon-amber' : 'text-noir-400 hover:text-white'
            }`}
          >
            Suspect Timeline
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'clues' ? (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3 overflow-hidden">
          
          {/* LEFT 2 COLUMNS: Clue Cards Grid */}
          <div className="lg:col-span-2 glass-panel p-3 sm:p-4 rounded-2xl border border-noir-800 flex flex-col min-h-0 overflow-hidden">
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-noir-800 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { soundService.playTypewriter(); setActiveCategory(cat.id); }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    activeCategory === cat.id
                      ? 'bg-noir-800 text-amber-400 border border-amber-600/50'
                      : 'text-noir-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Clues Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
              {filteredClues.map(clue => {
                const isDiscovered = clue.discovered;

                return (
                  <div
                    key={clue.id}
                    onClick={() => {
                      if (isDiscovered) {
                        soundService.playTypewriter();
                        setSelectedClue(clue);
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isDiscovered
                        ? selectedClue?.id === clue.id
                          ? 'bg-blood-950/70 border-blood-500 shadow-neon-red'
                          : 'bg-noir-950/80 border-noir-800 hover:border-amber-500/50'
                        : 'bg-noir-900/40 border-noir-850 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${
                          clue.category === 'forensic'
                            ? 'bg-blood-950 text-blood-400 border-blood-800'
                            : clue.category === 'digital'
                              ? 'bg-cyan-950 text-cyber-cyan border-cyan-800'
                              : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}>
                          {clue.category}
                        </span>

                        {isDiscovered ? (
                          <span className="flex items-center space-x-1 text-[10px] text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Logged</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 text-[10px] text-noir-500">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Undiscovered</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-white font-display mb-1">
                        {isDiscovered ? clue.title : "Classified Evidence Piece"}
                      </h4>
                      
                      <p className="text-[11px] text-noir-300 line-clamp-2 leading-relaxed">
                        {isDiscovered ? clue.description : "Search the crime scene or execute OSINT probes to discover this clue."}
                      </p>
                    </div>

                    {isDiscovered && (
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-amber-400">
                        <span>Inspect dossier</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Selected Clue Inspection Detail */}
          <div className="glass-panel p-4 rounded-2xl border border-noir-800 flex flex-col overflow-hidden bg-noir-950">
            {selectedClue ? (
              <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-noir-800">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Evidence Analysis # {selectedClue.id.toUpperCase()}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-blood-950 text-blood-400 border border-blood-800">
                      FORENSIC VERIFIED
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-display mb-2">
                    {selectedClue.title}
                  </h3>

                  <div className="space-y-3 text-xs text-noir-200">
                    <div className="bg-noir-900 p-3 rounded-xl border border-noir-800">
                      <span className="text-[10px] text-noir-400 uppercase block mb-1">Description</span>
                      <p className="leading-relaxed">{selectedClue.description}</p>
                    </div>

                    <div className="bg-blood-950/40 p-3 rounded-xl border border-blood-800/40">
                      <span className="text-[10px] text-blood-400 uppercase block mb-1 font-bold">Investigative Significance</span>
                      <p className="leading-relaxed text-amber-200">{selectedClue.significance}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-noir-900 rounded-xl border border-noir-800 text-[10px] text-noir-400">
                  <p>Status: Pinned to Corkboard • Available for Suspect Interrogation</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-noir-400">
                <FileText className="w-10 h-10 text-noir-600 mb-2" />
                <h4 className="text-xs font-bold text-white mb-1">Select an Evidence Item</h4>
                <p className="text-[11px]">Click on any discovered clue to view in-depth forensic laboratory notes.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Suspect Timeline Matrix */
        <div className="flex-1 glass-panel p-6 rounded-2xl border border-noir-800 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white font-display">
              Comparative Suspect Movement Timeline (20:00 - 23:45)
            </h3>
            <p className="text-xs text-noir-400">
              Cross-examine each suspect's self-reported alibi against physical timestamps and the 23:14 Time of Death.
            </p>
          </div>

          <div className="space-y-4">
            {activeCase.suspects.map(suspect => (
              <div key={suspect.id} className="p-4 rounded-xl bg-noir-950/80 border border-noir-800 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center space-x-3 w-60 flex-shrink-0">
                  <img
                    src={suspect.avatar}
                    alt={suspect.name}
                    className="w-10 h-10 rounded-lg object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{suspect.name}</h4>
                    <span className="text-[10px] text-noir-400">{suspect.role}</span>
                  </div>
                </div>

                <div className="flex-1 bg-noir-900 p-3 rounded-xl border border-noir-800 text-xs text-amber-200">
                  <span className="text-[10px] text-noir-400 block uppercase mb-0.5">Claimed Alibi</span>
                  "{suspect.publicAlibi}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
