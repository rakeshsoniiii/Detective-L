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
    { id: 'advisor', label: 'AI Director', icon: BrainCircuit },
    { id: 'pinboard', label: 'Connect Dots', icon: Network },
    { id: 'interrogate', label: 'Interrogation', icon: Users },
    { id: 'crimescene', label: 'Crime Scene', icon: Camera },
    { id: 'osint', label: 'OSINT Lab', icon: Search },
    { id: 'evidence', label: 'Dossier', icon: FileText },
    { id: 'verdict', label: 'Accusation', icon: Gavel },
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
    <header className="sticky top-0 z-50 glass-panel border-b border-noir-700/60 shadow-2xl backdrop-blur-xl flex-shrink-0">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Brand Logo & Creator */}
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blood-600 via-noir-900 to-amber-600 p-[1px] shadow-neon-red">
                <div className="w-full h-full bg-noir-950 rounded-lg flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-blood-500 animate-pulse" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blood-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blood-500"></span>
              </span>
            </div>
            
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-black text-base sm:text-lg lg:text-xl tracking-wider text-white whitespace-nowrap">
                  DETECTIVE<span className="text-blood-500">-L</span>
                </span>
                <span className="hidden xl:inline-block text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.2 rounded bg-blood-950/80 text-blood-400 border border-blood-800/60 whitespace-nowrap">
                  REAL FORENSICS
                </span>
              </div>
              <p className="hidden md:block text-[10px] xl:text-[11px] font-mono text-noir-400 whitespace-nowrap truncate">
                Created by <span className="text-amber-400 font-semibold">Rakesh Soni</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop / Large Screens) */}
          <nav className="hidden md:flex items-center space-x-1 bg-noir-900/90 p-1 rounded-xl border border-noir-800/80 flex-shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blood-600 to-blood-700 text-white shadow-neon-red'
                      : 'text-noir-300 hover:text-white hover:bg-noir-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-noir-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            
            {/* Case Selector Dropdown */}
            <div className="relative flex items-center">
              <select
                value={activeCase?.id}
                onChange={(e) => {
                  soundService.playTypewriter();
                  setActiveCaseId(e.target.value);
                }}
                className="bg-noir-900 text-xs font-mono text-amber-400 border border-noir-700 rounded-lg px-2 sm:px-2.5 py-1.5 pr-6 sm:pr-7 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer w-28 sm:w-36 md:w-44 lg:w-48 max-w-[190px] truncate"
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
              className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 text-xs font-mono transition-all flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyber-cyan animate-spin-slow flex-shrink-0" />
              <span className="hidden xl:inline">New Case / FIR</span>
              <span className="hidden sm:inline xl:hidden">New Case</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={() => {
                soundService.playTypewriter();
                onOpenApiKeyModal();
              }}
              title="API Key Settings"
              className="p-1.5 rounded-lg bg-noir-900 text-noir-300 hover:text-amber-400 border border-noir-800 transition-all flex-shrink-0"
            >
              <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleAudioToggle}
              title={isAudioMuted ? 'Unmute Detective SFX' : 'Mute SFX'}
              className="p-1.5 rounded-lg bg-noir-900 text-noir-300 hover:text-white border border-noir-800 transition-all flex-shrink-0"
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blood-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
            </button>
          </div>

        </div>

        {/* Mobile / Tablet Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-1.5 space-x-1 border-t border-noir-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap ${
                  isActive
                    ? 'bg-blood-600 text-white shadow-neon-red'
                    : 'bg-noir-900 text-noir-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
