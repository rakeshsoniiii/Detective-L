import React, { useState } from 'react';
import { 
  Search, 
  Terminal, 
  Globe, 
  Radio, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  MapPin, 
  FileCode, 
  Clock, 
  AlertCircle, 
  KeyRound, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { soundService } from '../services/soundService';

export default function OsintLab({ activeCase, onDiscoverClue }) {
  const [subTab, setSubTab] = useState('social');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    "[OSINT-SYSTEM] Initialized secure cyber-recon suite v4.9.1",
    "[NODE-44] Connected to Global Cell Tower CDR & DarkNet mirror index",
    "[STATUS] Ready for entity target query."
  ]);

  const osint = activeCase.osintData || { socialLeaks: [], geoTraces: [], forensics: [] };

  const handleRunScan = (customQuery = null) => {
    const q = customQuery || searchQuery;
    if (!q.trim()) return;

    soundService.playTypewriter();
    setIsScanning(true);
    setTerminalLogs(prev => [
      ...prev,
      `> SCAN INITIATED: Target '${q}'`,
      `[PROBE] Interrogating DarkNet leak databases & DNS relays...`,
    ]);

    setTimeout(() => {
      soundService.playClueFound();
      setIsScanning(false);
      setTerminalLogs(prev => [
        ...prev,
        `[MATCH] Found 2 indexed records for '${q}'`,
        `[INTEL] Decryption complete. Results loaded into OSINT viewport.`
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 h-[calc(100vh-4.5rem)] flex flex-col gap-4 font-mono">
      
      {/* Header & Tool Switcher */}
      <div className="glass-panel p-3 rounded-2xl border border-noir-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display text-white flex items-center space-x-2">
              <span>OSINT & Web Intelligence Matrix</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyber-cyan border border-cyan-800">
                LEVEL 4 CLEARANCE
              </span>
            </h2>
            <p className="text-[11px] text-noir-400">
              Scrape digital footprints, trace cell tower pings, and decrypt forensic phone dumps.
            </p>
          </div>
        </div>

        {/* Sub-tools switch */}
        <div className="flex items-center space-x-1 bg-noir-900 p-1 rounded-xl border border-noir-800">
          {[
            { id: 'social', label: 'DarkNet & Leaks', icon: Terminal },
            { id: 'geo', label: 'Cell Tower Geo-Trace', icon: MapPin },
            { id: 'forensics', label: 'Signal & Forensics', icon: FileCode },
          ].map(t => {
            const Icon = t.icon;
            const active = subTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  soundService.playTypewriter();
                  setSubTab(t.id);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  active
                    ? 'bg-cyber-cyan text-noir-950 shadow-neon-cyan'
                    : 'text-noir-300 hover:text-white hover:bg-noir-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main OSINT Workstation */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        
        {/* LEFT 2 COLUMNS: Visual Intel Panels */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-2xl border border-noir-800 flex flex-col overflow-hidden">
          
          {/* Quick Target Badges */}
          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-noir-800 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-noir-400 uppercase flex-shrink-0">Target Entity:</span>
            {activeCase.suspects.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setSearchQuery(s.name);
                  handleRunScan(s.name);
                }}
                className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-noir-900 hover:bg-noir-850 border border-noir-700 text-xs text-amber-300 hover:text-white transition-all"
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Search Query Input */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunScan()}
                placeholder="Search username, phone IMEI, BTC address, or employee alias..."
                className="w-full bg-noir-950 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl border border-noir-700 focus:outline-none focus:border-cyber-cyan transition-all"
              />
            </div>
            <button
              onClick={() => handleRunScan()}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs shadow-neon-cyan transition-all flex items-center space-x-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{isScanning ? 'Probing...' : 'Execute OSINT'}</span>
            </button>
          </div>

          {/* Tool 1: DarkNet & Social Leaks */}
          {subTab === 'social' && (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {osint.socialLeaks.length > 0 ? (
                osint.socialLeaks.map(leak => (
                  <div
                    key={leak.id}
                    className="p-4 rounded-xl bg-noir-950/80 border border-noir-800 hover:border-cyber-cyan/50 transition-all shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-cyber-cyan">{leak.target}</span>
                        <span className="text-[10px] text-noir-400 bg-noir-900 px-2 py-0.5 rounded border border-noir-800">
                          {leak.platform}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        leak.threatLevel === 'High' 
                          ? 'bg-blood-950 text-blood-400 border-blood-700' 
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        Threat: {leak.threatLevel}
                      </span>
                    </div>

                    <p className="text-xs text-noir-200 bg-noir-900/60 p-3 rounded-lg border border-white/5 mb-2 leading-relaxed">
                      {leak.snippet}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-noir-400">
                      <span>Timestamp: {leak.timestamp}</span>
                      <span className="text-amber-400 font-medium">{leak.notes}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-noir-400 text-xs">
                  <Terminal className="w-8 h-8 text-noir-600 mb-2 animate-pulse" />
                  <span>Enter a suspect name or query above to probe DarkNet indexes.</span>
                </div>
              )}
            </div>
          )}

          {/* Tool 2: Cell Tower Geo-Trace */}
          {subTab === 'geo' && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {osint.geoTraces.map(trace => (
                <div key={trace.id} className="p-4 rounded-xl bg-noir-950/80 border border-noir-800">
                  <div className="flex items-center justify-between mb-3 border-b border-noir-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blood-500" />
                      <h4 className="text-xs font-bold text-white">{trace.subject}</h4>
                    </div>
                    <span className="text-[10px] text-noir-400">{trace.device}</span>
                  </div>

                  {/* Movement Timeline */}
                  <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-noir-800">
                    {trace.logs.map((log, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-blood-500 group-hover:scale-125 transition-all"></div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-400">{log.time}</span>
                          <span className="text-noir-300">{log.tower}</span>
                          <span className="text-[11px] text-noir-400 bg-noir-900 px-2 py-0.5 rounded border border-noir-800">
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tool 3: Signal & Forensics */}
          {subTab === 'forensics' && (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {osint.forensics.map(f => (
                <div key={f.id} className="p-4 rounded-xl bg-noir-950/90 border border-noir-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-3.5 h-3.5 text-cyber-cyan" />
                      <h4 className="text-xs font-bold text-white">{f.title}</h4>
                    </div>
                    <span className="text-[10px] text-cyber-cyan bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {f.fileType}
                    </span>
                  </div>

                  <pre className="text-xs text-amber-200 bg-noir-900 p-3 rounded-lg border border-white/5 whitespace-pre-wrap font-mono leading-relaxed">
                    {f.preview}
                  </pre>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Live Cyber Recon Terminal Stream */}
        <div className="glass-panel p-4 rounded-2xl border border-noir-800 flex flex-col overflow-hidden bg-noir-950">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-noir-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Cpu className="w-4 h-4 text-cyber-cyan animate-spin-slow" />
              <span>Cyber Recon Feed</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              ONLINE
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 text-[11px] text-noir-300 font-mono pr-1 bg-black/50 p-3 rounded-xl border border-white/5">
            {terminalLogs.map((log, index) => (
              <div 
                key={index} 
                className={`${log.startsWith('>') ? 'text-amber-400 font-bold' : log.includes('[MATCH]') ? 'text-cyber-cyan font-bold' : 'text-noir-400'}`}
              >
                {log}
              </div>
            ))}
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-noir-900 border border-noir-800 text-[10px] text-noir-400 flex items-center justify-between">
            <span>Encrypted Proxy: Tor Onion V3</span>
            <span className="text-amber-400">Node: NY-RELAY-04</span>
          </div>
        </div>

      </div>

    </div>
  );
}
