import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  Network, 
  Users, 
  FileText, 
  Camera, 
  Gavel, 
  Volume2, 
  VolumeX, 
  Key, 
  Sparkles, 
  FolderOpen,
  BrainCircuit
} from 'lucide-react';
import { soundService } from '../services/soundService';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  activeCase, 
  cases, 
  setActiveCaseId, 
  onOpenCaseGenerator, 
  onOpenApiKeyModal,
  isAudioMuted,
  setIsAudioMuted,
  solvedCount
}) {
  const tabs = [
    { id: 'advisor', label: 'AI Director', icon: BrainCircuit, badge: 'Insights' },
    { id: 'pinboard', label: 'Connect Dots', icon: Network, badge: null },
    { id: 'interrogate', label: 'Interrogation', icon: Users, badge: `${activeCase?.suspects?.length || 5} Suspects` },
    { id: 'crimescene', label: 'Crime Scene', icon: Camera, badge: null },
    { id: 'osint', label: 'OSINT Lab', icon: Search, badge: 'Live 🇮🇳' },
    { id: 'evidence', label: 'Dossier', icon: FileText, badge: `${activeCase?.clues?.filter(c => c.discovered).length || 0}/${activeCase?.clues?.length || 0}` },
    { id: 'verdict', label: 'Accusation', icon: Gavel, badge: 'Court' },
  ];

  const handleTabChange = (tabId) => {
    soundService.playTypewriter();
    setCurrentTab(tabId);
  };

  const handleAudioToggle = () => {
    const muted = soundService.toggleMute();
    setIsAudioMuted(muted);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-noir-700/60 shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Creator */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blood-600 via-noir-900 to-amber-600 p-[1px] shadow-neon-red">
                <div className="w-full h-full bg-noir-950 rounded-lg flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-blood-500 animate-pulse" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blood-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blood-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-xl tracking-wider text-white">
                  DETECTIVE<span className="text-blood-500">-L</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-blood-950/80 text-blood-400 border border-blood-800/60">
                  REAL FORENSICS
                </span>
              </div>
              <p className="text-[11px] font-mono text-noir-400">
                Created by <span className="text-amber-400 font-semibold">Rakesh Soni</span> • Groq AI Case Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-noir-900/90 p-1.5 rounded-xl border border-noir-800/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blood-600 to-blood-700 text-white shadow-neon-red'
                      : 'text-noir-300 hover:text-white hover:bg-noir-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-noir-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      isActive 
                        ? 'bg-black/40 text-amber-300' 
                        : 'bg-noir-800 text-noir-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2">
            
            {/* Case Selector Dropdown */}
            <div className="relative flex items-center">
              <select
                value={activeCase?.id}
                onChange={(e) => {
                  soundService.playTypewriter();
                  setActiveCaseId(e.target.value);
                }}
                className="bg-noir-900 text-xs font-mono text-amber-400 border border-noir-700 rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer max-w-[200px] truncate"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <FolderOpen className="w-3.5 h-3.5 text-amber-500 absolute right-2 pointer-events-none" />
            </div>

            {/* AI Generator Button */}
            <button
              onClick={() => {
                soundService.playTypewriter();
                onOpenCaseGenerator();
              }}
              title="Start New Real Case or Import FIR"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 text-xs font-mono transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyber-cyan animate-spin-slow" />
              <span className="hidden lg:inline">New Case / FIR</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={() => {
                soundService.playTypewriter();
                onOpenApiKeyModal();
              }}
              title="Groq API Key Settings"
              className="p-1.5 rounded-lg bg-noir-900 text-noir-300 hover:text-amber-400 border border-noir-800 transition-all"
            >
              <Key className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleAudioToggle}
              title={isAudioMuted ? 'Unmute Detective SFX' : 'Mute SFX'}
              className="p-1.5 rounded-lg bg-noir-900 text-noir-300 hover:text-white border border-noir-800 transition-all"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-blood-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-noir-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono ${
                  isActive
                    ? 'bg-blood-600 text-white'
                    : 'bg-noir-900 text-noir-400'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
