import React, { useState, useRef, useEffect } from 'react';
import {
  Microscope, Terminal, Grid3X3, Search, Zap, Shield, AlertTriangle,
  Fingerprint, Cpu, Eye, ChevronRight, X, Wifi, Camera, Lock
} from 'lucide-react';
import { soundService } from '../services/soundService';

const FORENSIC_COMMANDS = {
  'help': { type: 'system', response: `Available forensic commands:
  ANALYZE CDR      — Analyze Call Detail Records from case evidence
  MATCH FINGERPRINT — Run AFIS fingerprint match against suspect database
  DECRYPT PHONE    — Decrypt phone/messaging logs from digital evidence
  TRACE CCTV       — Trace CCTV footage timestamps and corridor access
  AUTOPSY REPORT   — Pull central forensic examination findings
  CROSS REFERENCE  — Build suspect-evidence cross-reference matrix
  TIMELINE CHECK   — Verify alibi timeline contradictions
  CLEAR            — Clear terminal output` },

  'clear': { type: 'clear' },
};

function processCommand(cmd, activeCase) {
  const normalized = cmd.trim().toLowerCase();

  if (FORENSIC_COMMANDS[normalized]) {
    return FORENSIC_COMMANDS[normalized];
  }

  const clues = activeCase.clues || [];
  const suspects = activeCase.suspects || [];

  // ANALYZE CDR
  if (normalized.includes('analyze cdr') || normalized.includes('cdr') || normalized.includes('call detail') || normalized.includes('phone record')) {
    const digitalClues = clues.filter(c => c.category === 'digital' && c.discovered);
    if (digitalClues.length === 0) {
      return { type: 'warning', response: 'NO DIGITAL EVIDENCE RECOVERED. Investigate digital clues first in the Evidence Locker.' };
    }
    const lines = digitalClues.map((c, i) =>
      `[CDR-${String(i + 1).padStart(3, '0')}] ${c.title}\n  ├─ Source: ${c.category.toUpperCase()} INTERCEPT\n  ├─ Details: ${c.description}\n  └─ Significance: ${c.significance}`
    );
    return { type: 'success', response: `═══ CALL DETAIL RECORD ANALYSIS ═══\nRecords recovered: ${digitalClues.length}\n\n${lines.join('\n\n')}` };
  }

  // MATCH FINGERPRINT
  if (normalized.includes('fingerprint') || normalized.includes('afis') || normalized.includes('biometric')) {
    const physicalClues = clues.filter(c => c.category === 'physical' && c.discovered);
    const suspectList = suspects.map((s, i) =>
      `[SUS-${String(i + 1).padStart(2, '0')}] ${s.name} (${s.role})\n  ├─ Match Probability: ${s.isKiller ? '94.7%' : `${(Math.random() * 30 + 5).toFixed(1)}%`}\n  └─ Status: ${s.isKiller ? '⚠ HIGH CONFIDENCE MATCH' : 'Insufficient ridge detail'}`
    );
    return { type: 'success', response: `═══ AFIS FINGERPRINT ANALYSIS ═══\nLatent prints recovered: ${physicalClues.length} items\nSuspect database entries: ${suspects.length}\n\n${suspectList.join('\n\n')}\n\n${suspects.find(s => s.isKiller) ? `\n⚠ ALERT: High-confidence biometric match detected for ${suspects.find(s => s.isKiller).name}` : ''}` };
  }

  // DECRYPT PHONE
  if (normalized.includes('decrypt') || normalized.includes('phone') || normalized.includes('messaging') || normalized.includes('whatsapp')) {
    const digitalClues = clues.filter(c => c.category === 'digital' && c.discovered);
    if (digitalClues.length === 0) {
      return { type: 'warning', response: 'NO ENCRYPTED DEVICES IN EVIDENCE LOCKER. Discover digital clues first.' };
    }
    const entries = digitalClues.map((c, i) =>
      `[DEVICE-${i + 1}] ${c.title}\n  ├─ Encryption: AES-256 → DECRYPTED\n  ├─ Contents: ${c.description}\n  └─ Forensic Value: ${c.significance}`
    );
    return { type: 'success', response: `═══ DIGITAL FORENSIC DECRYPTION ═══\nDevices processed: ${digitalClues.length}\nDecryption engine: Detective-L Forensic Suite v4.2\n\n${entries.join('\n\n')}` };
  }

  // TRACE CCTV
  if (normalized.includes('cctv') || normalized.includes('camera') || normalized.includes('trace') || normalized.includes('footage')) {
    const cctvClues = clues.filter(c => (c.title + c.description).toLowerCase().includes('cctv') || (c.title + c.description).toLowerCase().includes('camera') || (c.title + c.description).toLowerCase().includes('footage'));
    const discovered = cctvClues.filter(c => c.discovered);
    if (discovered.length === 0) {
      const pending = cctvClues.filter(c => !c.discovered);
      return { type: 'warning', response: `NO CCTV FOOTAGE ANALYZED.\n${pending.length > 0 ? `${pending.length} footage source(s) pending discovery in Crime Scene.` : 'No CCTV evidence in this case file.'}` };
    }
    const entries = discovered.map((c, i) =>
      `[CAM-${String(i + 1).padStart(2, '0')}] ${c.title}\n  ├─ Timestamp: EXTRACTED\n  ├─ Footage: ${c.description}\n  └─ Intel: ${c.significance}`
    );
    return { type: 'success', response: `═══ CCTV CORRIDOR ACCESS TRACE ═══\nFootage sources analyzed: ${discovered.length}\n\n${entries.join('\n\n')}` };
  }

  // AUTOPSY REPORT
  if (normalized.includes('autopsy') || normalized.includes('forensic report') || normalized.includes('examination') || normalized.includes('toxicology') || normalized.includes('autopsy report')) {
    const forensicClues = clues.filter(c => c.category === 'forensic' && c.discovered);
    if (forensicClues.length === 0) {
      return { type: 'warning', response: 'AUTOPSY REPORT NOT YET FILED. Discover forensic evidence first.' };
    }
    const entries = forensicClues.map((c, i) =>
      `[FORENSIC-${String(i + 1).padStart(2, '0')}] ${c.title}\n  ├─ Classification: ${c.category.toUpperCase()}\n  ├─ Findings: ${c.description}\n  └─ Conclusion: ${c.significance}`
    );
    return { type: 'success', response: `═══ CENTRAL FORENSIC AUTOPSY REPORT ═══\nCase: ${activeCase.title}\nVictim: ${activeCase.victim} (${activeCase.victimRole})\nTime of Death: ${activeCase.timeOfDeath}\nCrime Details: ${activeCase.crimeDetails}\nMurder Weapon: ${activeCase.murderWeapon}\n\n${entries.join('\n\n')}` };
  }

  // CROSS REFERENCE
  if (normalized.includes('cross ref') || normalized.includes('cross-ref') || normalized.includes('matrix')) {
    return { type: 'info', response: 'Cross-Reference Matrix rendered in the panel above. Switch to the Matrix tab for the interactive grid.' };
  }

  // TIMELINE CHECK
  if (normalized.includes('timeline') || normalized.includes('alibi')) {
    const contradictions = suspects.filter(s => s.hiddenSecret && s.publicAlibi);
    const lines = contradictions.map((s, i) =>
      `[${String(i + 1).padStart(2, '0')}] ${s.name}\n  ├─ PUBLIC ALIBI: "${s.publicAlibi}"\n  ├─ HIDDEN TRUTH: "${s.hiddenSecret}"\n  └─ STATUS: ${s.isKiller ? '⚠ CRITICAL CONTRADICTION — PRIME SUSPECT' : '⚡ Alibi gap detected'}`
    );
    return { type: 'success', response: `═══ ALIBI TIMELINE VERIFICATION ═══\nSuspects checked: ${suspects.length}\nContradictions found: ${contradictions.length}\n\n${lines.join('\n\n')}` };
  }

  return { type: 'error', response: `Unknown command: "${cmd}"\nType HELP for available forensic commands.` };
}

export default function ForensicLab({ activeCase, onDiscoverClue }) {
  const [activeStation, setActiveStation] = useState('microscope'); // 'microscope', 'terminal', 'matrix'
  const [selectedClue, setSelectedClue] = useState(null);
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: `Detective-L Forensic Terminal v4.2\nCase: ${activeCase?.title || 'No Active Case'}\nType HELP for available commands.\n` }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    soundService.playTypewriter();

    const cmd = terminalInput.trim();
    setTerminalHistory(prev => [...prev, { type: 'input', text: `forensic@detective-l:~$ ${cmd}` }]);

    const result = processCommand(cmd, activeCase);
    if (result.type === 'clear') {
      setTerminalHistory([{ type: 'system', text: 'Terminal cleared. Type HELP for commands.' }]);
    } else {
      setTerminalHistory(prev => [...prev, { type: result.type, text: result.response }]);
    }
    setTerminalInput('');
  };

  const discoveredClues = (activeCase.clues || []).filter(c => c.discovered);
  const suspects = activeCase.suspects || [];

  // Build cross-reference matrix
  const connections = activeCase.defaultConnections || [];

  const stations = [
    { id: 'microscope', label: 'Evidence Microscope', icon: Microscope },
    { id: 'terminal', label: 'Decryption Terminal', icon: Terminal },
    { id: 'matrix', label: 'Cross-Reference Matrix', icon: Grid3X3 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 h-full flex-1 min-h-0 flex flex-col gap-3 overflow-hidden font-mono">

      {/* Header */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-noir-800 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-500 border border-emerald-500/30 flex-shrink-0">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold font-display text-white">
              Forensic Analysis Laboratory
            </h2>
            <p className="text-[11px] text-noir-400">
              {discoveredClues.length} evidence items available • {suspects.length} suspects in database
            </p>
          </div>
        </div>

        {/* Station Switcher */}
        <div className="flex items-center space-x-1 bg-noir-900 p-1 rounded-xl border border-noir-800">
          {stations.map((st) => {
            const Icon = st.icon;
            return (
              <button
                key={st.id}
                onClick={() => { setActiveStation(st.id); soundService.playTypewriter(); }}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeStation === st.id
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-noir-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Station Content */}
      <div className="flex-1 min-h-0 overflow-hidden">

        {/* STATION 1: Evidence Microscope */}
        {activeStation === 'microscope' && (
          <div className="h-full flex gap-3 overflow-hidden">
            {/* Evidence List */}
            <div className="w-64 flex-shrink-0 glass-panel rounded-2xl border border-noir-800 p-3 overflow-y-auto space-y-2">
              <h3 className="text-[10px] uppercase text-noir-500 font-bold tracking-wider mb-2">
                Evidence Items ({discoveredClues.length})
              </h3>
              {discoveredClues.map((clue) => (
                <button
                  key={clue.id}
                  onClick={() => { setSelectedClue(clue); soundService.playTypewriter(); }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    selectedClue?.id === clue.id
                      ? 'bg-emerald-600/10 border-emerald-500/40 text-white'
                      : 'bg-noir-900/50 border-noir-800 text-noir-300 hover:text-white hover:border-noir-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      clue.category === 'physical' ? 'bg-amber-500' :
                      clue.category === 'forensic' ? 'bg-blood-500' :
                      clue.category === 'digital' ? 'bg-cyber-cyan' : 'bg-purple-500'
                    }`} />
                    <span className="text-xs font-bold truncate">{clue.title}</span>
                  </div>
                  <span className="text-[9px] text-noir-500 uppercase mt-1 block">{clue.category}</span>
                </button>
              ))}
              {discoveredClues.length === 0 && (
                <p className="text-[11px] text-noir-500 text-center py-8">
                  No evidence discovered yet. Investigate the Crime Scene and OSINT Lab first.
                </p>
              )}
            </div>

            {/* Detail Panel */}
            <div className="flex-1 glass-panel rounded-2xl border border-noir-800 p-4 overflow-y-auto">
              {selectedClue ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl border ${
                        selectedClue.category === 'physical' ? 'bg-amber-600/10 text-amber-500 border-amber-500/30' :
                        selectedClue.category === 'forensic' ? 'bg-blood-600/10 text-blood-500 border-blood-500/30' :
                        selectedClue.category === 'digital' ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30' :
                        'bg-purple-600/10 text-purple-500 border-purple-500/30'
                      }`}>
                        {selectedClue.category === 'physical' ? <Fingerprint className="w-5 h-5" /> :
                         selectedClue.category === 'forensic' ? <Microscope className="w-5 h-5" /> :
                         selectedClue.category === 'digital' ? <Cpu className="w-5 h-5" /> :
                         <Eye className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{selectedClue.title}</h3>
                        <span className="text-[10px] uppercase text-noir-500">{selectedClue.category} Evidence</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-noir-950 border border-noir-800 space-y-2">
                    <h4 className="text-[10px] uppercase text-emerald-400 font-bold">Forensic Description</h4>
                    <p className="text-xs text-noir-200 leading-relaxed">{selectedClue.description}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-2">
                    <h4 className="text-[10px] uppercase text-amber-400 font-bold">Investigative Significance</h4>
                    <p className="text-xs text-amber-200 leading-relaxed">{selectedClue.significance}</p>
                  </div>

                  {/* Cross-referenced suspects */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase text-blood-400 font-bold">Linked Suspects</h4>
                    {connections
                      .filter(conn => conn.from === selectedClue.id || conn.to === selectedClue.id)
                      .map((conn, idx) => {
                        const suspectId = conn.from === selectedClue.id ? conn.to : conn.from;
                        const suspect = suspects.find(s => s.id === suspectId);
                        if (!suspect) return null;
                        return (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-noir-900 border border-noir-800">
                            <div className="flex items-center space-x-2">
                              <Shield className={`w-4 h-4 ${suspect.isKiller ? 'text-blood-400' : 'text-noir-400'}`} />
                              <span className="text-xs font-bold text-white">{suspect.name}</span>
                              <span className="text-[9px] text-noir-500">{suspect.role}</span>
                            </div>
                            <span className="text-[10px] text-amber-400">{conn.label || 'Connected'}</span>
                          </div>
                        );
                      })}
                    {connections.filter(conn => conn.from === selectedClue.id || conn.to === selectedClue.id).length === 0 && (
                      <p className="text-[11px] text-noir-500 italic">No suspect connections established yet. Use the Pinboard to draw links.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <Microscope className="w-12 h-12 text-noir-700 mx-auto mb-3" />
                    <p className="text-sm text-noir-500">Select an evidence item from the left panel to analyze</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STATION 2: Decryption Terminal */}
        {activeStation === 'terminal' && (
          <div className="h-full glass-panel rounded-2xl border border-emerald-800/40 overflow-hidden flex flex-col">
            {/* Terminal Output */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-noir-950 font-mono text-xs space-y-1">
              {terminalHistory.map((entry, idx) => (
                <pre
                  key={idx}
                  className={`whitespace-pre-wrap leading-relaxed ${
                    entry.type === 'input' ? 'text-cyber-cyan' :
                    entry.type === 'success' ? 'text-emerald-400' :
                    entry.type === 'warning' ? 'text-amber-400' :
                    entry.type === 'error' ? 'text-blood-400' :
                    entry.type === 'info' ? 'text-purple-400' :
                    'text-noir-300'
                  }`}
                >
                  {entry.text}
                </pre>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input */}
            <form onSubmit={handleTerminalSubmit} className="flex-shrink-0 border-t border-noir-800 bg-noir-900 p-3">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-500 text-xs font-bold flex-shrink-0">forensic@detective-l:~$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type a forensic command (e.g., ANALYZE CDR, MATCH FINGERPRINT, DECRYPT PHONE)..."
                  className="flex-1 bg-transparent text-xs text-white focus:outline-none font-mono placeholder:text-noir-600"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 text-xs font-bold hover:bg-emerald-600/30 transition-all"
                >
                  Execute
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STATION 3: Cross-Reference Matrix */}
        {activeStation === 'matrix' && (
          <div className="h-full glass-panel rounded-2xl border border-noir-800 p-4 overflow-auto">
            <h3 className="text-xs font-bold text-white mb-3 flex items-center space-x-2">
              <Grid3X3 className="w-4 h-4 text-purple-400" />
              <span>Evidence × Suspect Cross-Reference Matrix</span>
            </h3>

            {discoveredClues.length > 0 && suspects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-10 bg-noir-950 p-2 text-left text-noir-400 border border-noir-800 min-w-[140px]">
                        Evidence ↓ / Suspect →
                      </th>
                      {suspects.map((s) => (
                        <th
                          key={s.id}
                          className={`p-2 text-center border border-noir-800 min-w-[100px] ${
                            s.isKiller ? 'bg-blood-950/30 text-blood-400' : 'bg-noir-900 text-noir-300'
                          }`}
                        >
                          {s.name.split(' ')[0]}
                          {s.isKiller && <span className="block text-[8px] text-blood-500">★</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {discoveredClues.map((clue) => (
                      <tr key={clue.id}>
                        <td className="sticky left-0 z-10 bg-noir-950 p-2 border border-noir-800 text-white font-bold">
                          <div className="flex items-center space-x-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              clue.category === 'physical' ? 'bg-amber-500' :
                              clue.category === 'forensic' ? 'bg-blood-500' :
                              clue.category === 'digital' ? 'bg-cyber-cyan' : 'bg-purple-500'
                            }`} />
                            <span className="truncate max-w-[120px]">{clue.title}</span>
                          </div>
                        </td>
                        {suspects.map((s) => {
                          const hasConnection = connections.some(
                            conn =>
                              (conn.from === clue.id && conn.to === s.id) ||
                              (conn.to === clue.id && conn.from === s.id)
                          );
                          // Check for implicit links via clue text mentioning suspect
                          const textMatch = (clue.description + ' ' + clue.significance)
                            .toLowerCase()
                            .includes(s.name.split(' ')[0].toLowerCase());
                          const isContradiction = hasConnection && s.isKiller;

                          return (
                            <td
                              key={s.id}
                              className={`p-2 text-center border border-noir-800 ${
                                isContradiction ? 'bg-blood-950/40' :
                                hasConnection ? 'bg-emerald-950/30' :
                                textMatch ? 'bg-amber-950/20' :
                                'bg-noir-950'
                              }`}
                            >
                              {isContradiction ? (
                                <span className="text-blood-400 font-bold">⚠ LINK</span>
                              ) : hasConnection ? (
                                <span className="text-emerald-400">● CONN</span>
                              ) : textMatch ? (
                                <span className="text-amber-400/70">~ REF</span>
                              ) : (
                                <span className="text-noir-700">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-noir-500">Discover evidence and suspects to build the cross-reference matrix.</p>
              </div>
            )}

            {/* Matrix Legend */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-noir-400 mt-4 pt-3 border-t border-noir-800">
              <div className="flex items-center space-x-1.5">
                <span className="text-blood-400 font-bold">⚠ LINK</span>
                <span>Direct connection to prime suspect</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-emerald-400">● CONN</span>
                <span>Established pinboard connection</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-amber-400/70">~ REF</span>
                <span>Text reference detected</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-noir-700">—</span>
                <span>No link</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
