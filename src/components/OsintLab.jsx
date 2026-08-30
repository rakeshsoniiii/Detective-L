import React, { useState } from 'react';
import { 
  Search, 
  Terminal, 
  Globe, 
  Phone, 
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
  ExternalLink,
  Smartphone,
  UserCheck,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { analyzePhoneNumber, POPULAR_OSINT_PLATFORMS, generateCaseDorks } from '../services/osintToolsService';

export default function OsintLab({ activeCase, onDiscoverClue }) {
  const [subTab, setSubTab] = useState('phone_recon'); // 'phone_recon', 'username_recon', 'case_dorks', 'case_intel'
  
  // Real Phone OSINT State
  const [phoneInput, setPhoneInput] = useState('9820012345');
  const [phoneResult, setPhoneResult] = useState(() => analyzePhoneNumber('9820012345'));
  
  // Real Username OSINT State
  const [usernameInput, setUsernameInput] = useState('detective_rakesh');
  const [usernameQuery, setUsernameQuery] = useState('detective_rakesh');

  // Case Digital Intel State
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    "[OSINT-SYSTEM] Initialized Real & Cyber Recon Suite v5.0",
    "[INDIA-DOT] Connected to National Numbering Plan & Telecom MSC Series",
    "[READY] Enter Indian Mobile (+91) or International Number for Live Recon."
  ]);

  const osint = activeCase?.osintData || { socialLeaks: [], geoTraces: [], forensics: [] };
  const caseDorks = generateCaseDorks(activeCase?.title, activeCase?.victim, activeCase?.location);

  const handlePhoneAnalyze = (customNum = null) => {
    const num = customNum || phoneInput;
    if (!num.trim()) return;
    soundService.playTypewriter();
    const result = analyzePhoneNumber(num);
    setPhoneResult(result);
    setTerminalLogs(prev => [
      ...prev,
      `> ANALYZING NUMBER: ${num}`,
      `[CARRIER] ${result.operator} | Circle: ${result.telecomCircle}`,
      `[FORMAT] E.164: ${result.e164} | UPI VPAs & Dork links ready.`
    ]);
  };

  const handleCopy = (text) => {
    soundService.playTypewriter();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 1500);
  };

  const handleRunCaseScan = (customQuery = null) => {
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
        `[MATCH] Found indexed records for '${q}'`,
        `[INTEL] Decryption complete. Results loaded into OSINT viewport.`
      ]);
    }, 900);
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
              <span>OSINT & Real-World Intelligence Lab</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                LIVE & FREE TOOLS
              </span>
            </h2>
            <p className="text-[11px] text-noir-400">
              Indian mobile telecom circle recon, global username scanner, and police FIR / legal court dorking.
            </p>
          </div>
        </div>

        {/* Sub-tools switch */}
        <div className="flex items-center space-x-1 bg-noir-900 p-1 rounded-xl border border-noir-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'phone_recon', label: '🇮🇳 Phone Recon', icon: Smartphone },
            { id: 'username_recon', label: 'Handle Scanner', icon: UserCheck },
            { id: 'case_dorks', label: 'Legal & FIR Dorks', icon: FileText },
            { id: 'case_intel', label: 'Case Cyber Logs', icon: Terminal },
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
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
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

      {/* Main OSINT Workstation Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        
        {/* LEFT 2 COLUMNS: Selected Tool Workstation */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-2xl border border-noir-800 flex flex-col overflow-hidden">
          
          {/* TAB 1: REAL INDIAN & GLOBAL MOBILE NUMBER OSINT */}
          {subTab === 'phone_recon' && (
            <div className="flex-1 flex flex-col overflow-y-auto space-y-4 pr-1">
              
              {/* Input Card */}
              <div className="bg-noir-950/80 p-4 rounded-xl border border-noir-800">
                <label className="block text-xs font-bold text-cyber-cyan uppercase mb-2">
                  Enter Indian Mobile Number (10-Digits or +91) or International Number:
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePhoneAnalyze()}
                      placeholder="e.g. 9820012345 or +91 9876543210"
                      className="w-full bg-noir-900 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl border border-noir-700 focus:outline-none focus:border-cyber-cyan font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handlePhoneAnalyze()}
                    className="px-4 py-2.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs shadow-neon-cyan transition-all flex items-center space-x-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Run Phone OSINT</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-[10px] text-noir-400">Quick Test Samples:</span>
                  {['9820012345 (Mumbai Airtel)', '9810012345 (Delhi Airtel)', '7000123456 (Jio)', '9415012345 (UP East BSNL)'].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const num = s.split(' ')[0];
                        setPhoneInput(num);
                        handlePhoneAnalyze(num);
                      }}
                      className="text-[10px] text-amber-300 hover:text-white bg-noir-900 px-2 py-0.5 rounded border border-noir-800"
                    >
                      {s.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analysis Results Card */}
              {phoneResult && (
                <div className="space-y-3">
                  
                  {/* Carrier & Circle Badge Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-noir-950/90 border border-noir-800">
                      <span className="text-[10px] text-noir-400 block uppercase">Original Telecom Carrier</span>
                      <span className="text-xs font-bold text-amber-300 font-mono mt-0.5 block">
                        {phoneResult.operator}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-noir-950/90 border border-noir-800">
                      <span className="text-[10px] text-noir-400 block uppercase">State / Telecom Circle</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">
                        {phoneResult.telecomCircle}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-noir-950/90 border border-noir-800">
                      <span className="text-[10px] text-noir-400 block uppercase">International E.164 Format</span>
                      <span className="text-xs font-bold text-cyber-cyan font-mono mt-0.5 block">
                        {phoneResult.e164}
                      </span>
                    </div>
                  </div>

                  {/* Direct OSINT Jump Links */}
                  <div className="bg-noir-950/90 p-4 rounded-xl border border-noir-800">
                    <h4 className="text-xs font-bold text-white uppercase mb-3 flex items-center space-x-1.5">
                      <Globe className="w-4 h-4 text-cyber-cyan" />
                      <span>Live Direct Investigation Actions</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href={phoneResult.whatsappDirectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-between transition-all"
                      >
                        <span>WhatsApp Quick Check (No Contact Save)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={phoneResult.truecallerSearchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-lg bg-blue-950/60 hover:bg-blue-900 border border-blue-800/60 text-xs text-blue-300 flex items-center justify-between transition-all"
                      >
                        <span>Truecaller Web Registry Query</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Indian UPI VPA Permutations */}
                  {phoneResult.possibleUPIVPAs.length > 0 && (
                    <div className="bg-noir-950/90 p-4 rounded-xl border border-noir-800">
                      <h4 className="text-xs font-bold text-amber-400 uppercase mb-2">
                        Potential Indian UPI Payment Handles (For Name Verification)
                      </h4>
                      <p className="text-[11px] text-noir-400 mb-3">
                        Use any standard UPI app (BHIM, GPay, Paytm) to verify account holder registration:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {phoneResult.possibleUPIVPAs.map((vpa, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-noir-900 border border-noir-800 text-xs text-noir-200">
                            <span>{vpa}</span>
                            <button
                              onClick={() => handleCopy(vpa)}
                              className="text-noir-400 hover:text-white p-1"
                              title="Copy VPA"
                            >
                              {copiedText === vpa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Google Dork Queries */}
                  <div className="bg-noir-950/90 p-4 rounded-xl border border-noir-800">
                    <h4 className="text-xs font-bold text-cyber-cyan uppercase mb-2">
                      Target Google Dorks for Leaked Files & Public Directory Mentions
                    </h4>
                    <div className="space-y-1.5">
                      {phoneResult.googleDorkQueries.map((dork, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-noir-900 border border-noir-800 text-xs">
                          <code className="text-amber-200 truncate flex-1 mr-2">{dork}</code>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleCopy(dork)}
                              className="p-1 text-noir-400 hover:text-white"
                              title="Copy Dork"
                            >
                              {copiedText === dork ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(dork)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-cyber-cyan hover:text-white"
                              title="Execute on Google"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 2: GLOBAL USERNAME RECON */}
          {subTab === 'username_recon' && (
            <div className="flex-1 flex flex-col overflow-y-auto space-y-4 pr-1">
              <div className="bg-noir-950/80 p-4 rounded-xl border border-noir-800">
                <label className="block text-xs font-bold text-cyber-cyan uppercase mb-2">
                  Target Username / Handle Search:
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <UserCheck className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setUsernameQuery(usernameInput)}
                      placeholder="e.g. rakesh_soni or shadow_zero"
                      className="w-full bg-noir-900 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl border border-noir-700 focus:outline-none focus:border-cyber-cyan font-mono"
                    />
                  </div>
                  <button
                    onClick={() => {
                      soundService.playTypewriter();
                      setUsernameQuery(usernameInput);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs shadow-neon-cyan transition-all"
                  >
                    Scan Handles
                  </button>
                </div>
              </div>

              {/* Platforms Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {POPULAR_OSINT_PLATFORMS.map((platform, idx) => {
                  const targetUrl = platform.url.replace('{username}', encodeURIComponent(usernameQuery));
                  return (
                    <a
                      key={idx}
                      href={targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-noir-950/90 border border-noir-800 hover:border-cyber-cyan/60 hover:bg-noir-900 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyber-cyan">
                          {platform.name}
                        </h4>
                        <span className="text-[10px] text-noir-400 truncate block max-w-[150px]">
                          @{usernameQuery}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-noir-500 group-hover:text-cyber-cyan" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LEGAL & POLICE FIR GOOGLE DORKS */}
          {subTab === 'case_dorks' && (
            <div className="flex-1 flex flex-col overflow-y-auto space-y-3 pr-1">
              <div className="bg-noir-950/80 p-3 rounded-xl border border-noir-800 mb-1">
                <span className="text-xs font-bold text-amber-400 uppercase block mb-1">
                  Active Case Research Dorks: {activeCase?.title}
                </span>
                <p className="text-[11px] text-noir-400">
                  Pre-configured Google search operators to locate Indian Kanoon court judgments, eCourts records, and state police bulletins.
                </p>
              </div>

              {caseDorks.map((dork, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-noir-950/90 border border-noir-800 hover:border-amber-500/40 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-white">{dork.title}</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopy(dork.query)}
                        className="text-[10px] text-noir-400 hover:text-white flex items-center space-x-1"
                      >
                        {copiedText === dork.query ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                      <a
                        href={dork.query.startsWith('http') ? dork.query : `https://www.google.com/search?q=${encodeURIComponent(dork.query)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center space-x-1 hover:bg-amber-900"
                      >
                        <span>Search Google</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <p className="text-[10px] text-noir-400 mb-2">{dork.description}</p>
                  <code className="text-xs text-amber-300 bg-noir-900 p-2 rounded block break-all font-mono border border-white/5">
                    {dork.query}
                  </code>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CASE DIGITAL LOGS & FORENSICS */}
          {subTab === 'case_intel' && (
            <div className="flex-1 flex flex-col overflow-y-auto space-y-3 pr-1">
              <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-noir-800 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-noir-400 uppercase flex-shrink-0">Suspect Query:</span>
                {activeCase?.suspects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSearchQuery(s.name);
                      handleRunCaseScan(s.name);
                    }}
                    className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-noir-900 hover:bg-noir-850 border border-noir-700 text-xs text-amber-300 hover:text-white transition-all"
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {osint.socialLeaks.map(leak => (
                <div key={leak.id} className="p-3.5 rounded-xl bg-noir-950/80 border border-noir-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-cyber-cyan">{leak.target}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blood-950 text-blood-400 border border-blood-800">
                      {leak.threatLevel}
                    </span>
                  </div>
                  <p className="text-xs text-noir-200 bg-noir-900/60 p-2.5 rounded-lg border border-white/5 mb-2">
                    {leak.snippet}
                  </p>
                  <span className="text-[10px] text-amber-400">{leak.notes}</span>
                </div>
              ))}

              {osint.forensics.map(f => (
                <div key={f.id} className="p-3.5 rounded-xl bg-noir-950/90 border border-noir-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-white">{f.title}</h4>
                    <span className="text-[9px] text-cyber-cyan bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {f.fileType}
                    </span>
                  </div>
                  <pre className="text-xs text-amber-200 bg-noir-900 p-2.5 rounded-lg border border-white/5 whitespace-pre-wrap">
                    {f.preview}
                  </pre>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Live Cyber Recon Terminal Feed */}
        <div className="glass-panel p-4 rounded-2xl border border-noir-800 flex flex-col overflow-hidden bg-noir-950">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-noir-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Cpu className="w-4 h-4 text-cyber-cyan animate-spin-slow" />
              <span>Real-Time OSINT Console</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              READY
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 text-[11px] text-noir-300 font-mono pr-1 bg-black/50 p-3 rounded-xl border border-white/5">
            {terminalLogs.map((log, index) => (
              <div 
                key={index} 
                className={`${log.startsWith('>') ? 'text-amber-400 font-bold' : log.includes('[CARRIER]') || log.includes('[MATCH]') ? 'text-cyber-cyan font-bold' : 'text-noir-400'}`}
              >
                {log}
              </div>
            ))}
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-noir-900 border border-noir-800 text-[10px] text-noir-400 flex items-center justify-between">
            <span>DoT MSC Table: Updated 2026</span>
            <span className="text-emerald-400">Live Recon Engine</span>
          </div>
        </div>

      </div>

    </div>
  );
}
