import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Terminal, 
  Globe, 
  Phone, 
  Mail, 
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
  Check,
  User,
  Fingerprint,
  HardDrive,
  Monitor,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { analyzePhoneNumber, generateCaseDorks } from '../services/osintToolsService';
import { scanLiveUsername, scanLiveEmail, getDeviceFingerprint } from '../services/realOsintScanner';

export default function OsintLab({ activeCase, onDiscoverClue }) {
  const [subTab, setSubTab] = useState('email_recon'); // 'email_recon', 'username_recon', 'phone_recon', 'fingerprint_recon', 'case_dorks', 'case_intel'
  
  // Real Phone OSINT State
  const [phoneInput, setPhoneInput] = useState('9820012345');
  const [phoneResult, setPhoneResult] = useState(() => analyzePhoneNumber('9820012345'));
  
  // Real Email OSINT State
  const [emailInput, setEmailInput] = useState('rakeshsoni28073@gmail.com');
  const [emailResult, setEmailResult] = useState(null);
  const [isScanningEmail, setIsScanningEmail] = useState(false);

  // Real Username OSINT State
  const [usernameInput, setUsernameInput] = useState('rakeshsoniiii');
  const [usernameResults, setUsernameResults] = useState([]);
  const [isScanningUsername, setIsScanningUsername] = useState(false);

  // Real Device Fingerprint State (like fingerprint.to)
  const [deviceData, setDeviceData] = useState(null);
  const [isFingerprinting, setIsFingerprinting] = useState(false);

  // Case Digital Intel State
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    "[OSINT-ENGINE] Initialized Live Multi-Vector Recon Suite v6.0",
    "[STATUS] Programmatic Live APIs active: GitHub, Gravatar, Reddit, Dev.to, HackerNews",
    "[STATUS] Fingerprint.to Hardware Engine: Ready"
  ]);

  const osint = activeCase?.osintData || { socialLeaks: [], geoTraces: [], forensics: [] };
  const caseDorks = generateCaseDorks(activeCase?.title, activeCase?.victim, activeCase?.location);

  // Initial Scan on Mount
  useEffect(() => {
    handleRunEmailScan('rakeshsoni28073@gmail.com');
  }, []);

  const handleRunEmailScan = async (customEmail = null) => {
    const mail = customEmail || emailInput;
    if (!mail.trim() || !mail.includes('@')) return;

    soundService.playTypewriter();
    setIsScanningEmail(true);
    setTerminalLogs(prev => [
      ...prev,
      `> SCANNING EMAIL: ${mail}`,
      `[PROBE] Calculating MD5 hash & interrogating Gravatar / GitHub APIs...`
    ]);

    try {
      const result = await scanLiveEmail(mail);
      setEmailResult(result);
      soundService.playClueFound();
      setTerminalLogs(prev => [
        ...prev,
        `[SUCCESS] Domain: ${result.domain} | Provider: ${result.providerType}`,
        `[GRAVATAR] ${result.gravatarFound ? 'Public Avatar Detected' : 'No Public Avatar'} | MD5: ${result.md5Hash}`
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanningEmail(false);
    }
  };

  const handleRunUsernameScan = async (customUser = null) => {
    const user = customUser || usernameInput;
    if (!user.trim()) return;

    soundService.playTypewriter();
    setIsScanningUsername(true);
    setTerminalLogs(prev => [
      ...prev,
      `> PROBING LIVE USERNAME: "${user}"`,
      `[PROBE] Executing live Sherlock-style REST queries across GitHub, Reddit, Dev.to, HackerNews...`
    ]);

    try {
      const results = await scanLiveUsername(user);
      setUsernameResults(results);
      soundService.playClueFound();
      const foundCount = results.filter(r => r.status === 'FOUND').length;
      setTerminalLogs(prev => [
        ...prev,
        `[COMPLETED] Live accounts discovered: ${foundCount} active verified profiles found.`
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanningUsername(false);
    }
  };

  const handleRunFingerprinting = async () => {
    soundService.playTypewriter();
    setIsFingerprinting(true);
    setTerminalLogs(prev => [
      ...prev,
      `> GENERATING FORENSIC HARDWARE FINGERPRINT (Fingerprint.to style)...`,
      `[PROBE] Extracting Canvas 2D, WebGL GPU Vendor, AudioContext hash & Entropy metrics...`
    ]);

    try {
      const data = await getDeviceFingerprint();
      setDeviceData(data);
      soundService.playClueFound();
      setTerminalLogs(prev => [
        ...prev,
        `[SUCCESS] Unique Forensic Visitor ID: ${data.visitorId}`,
        `[GPU] ${data.webglVendor} - ${data.webglRenderer}`,
        `[CANVAS-HASH] ${data.canvasHash}`
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFingerprinting(false);
    }
  };

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
      `[REVERSE-LOOKUP] Loaded 5 Name Discovery methods.`
    ]);
  };

  const handleCopy = (text) => {
    soundService.playTypewriter();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 1500);
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
              <span>Real-Time OSINT & Forensic Investigation Hub</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                LIVE APIs ACTIVE
              </span>
            </h2>
            <p className="text-[11px] text-noir-400">
              Live programmatic recon across Email, Username accounts, Phone carriers, and Hardware Fingerprinting.
            </p>
          </div>
        </div>

        {/* Sub-tools switch */}
        <div className="flex items-center space-x-1 bg-noir-900 p-1 rounded-xl border border-noir-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'email_recon', label: '📧 Live Email Recon', icon: Mail },
            { id: 'username_recon', label: '👤 Live Username Recon', icon: UserCheck },
            { id: 'fingerprint_recon', label: '🔬 Fingerprint.to', icon: Fingerprint },
            { id: 'phone_recon', label: '📱 Phone Recon', icon: Smartphone },
            { id: 'case_dorks', label: '⚖️ Legal Dorks', icon: FileText },
            { id: 'case_intel', label: '📁 Case Logs', icon: Terminal },
          ].map(t => {
            const Icon = t.icon;
            const active = subTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  soundService.playTypewriter();
                  setSubTab(t.id);
                  if (t.id === 'fingerprint_recon' && !deviceData) {
                    handleRunFingerprinting();
                  }
                  if (t.id === 'username_recon' && usernameResults.length === 0) {
                    handleRunUsernameScan('rakeshsoniiii');
                  }
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
        
        {/* LEFT 2 COLUMNS: Workstation */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-2xl border border-noir-800 flex flex-col overflow-hidden">
          
          {/* TAB 1: LIVE EMAIL RECON */}
          {subTab === 'email_recon' && (
            <div className="flex-1 flex flex-col overflow-y-auto space-y-4 pr-1">
              
              {/* Email Input */}
              <div className="bg-noir-950/80 p-4 rounded-xl border border-noir-800">
                <label className="block text-xs font-bold text-cyber-cyan uppercase mb-2">
                  Live Programmatic Email OSINT & Identity Search:
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRunEmailScan()}
                      placeholder="e.g. rakeshsoni28073@gmail.com"
                      className="w-full bg-noir-900 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl border border-noir-700 focus:outline-none focus:border-cyber-cyan font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleRunEmailScan()}
                    disabled={isScanningEmail}
                    className="px-4 py-2.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs shadow-neon-cyan transition-all flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isScanningEmail ? 'Probing...' : 'Run Live Email OSINT'}</span>
                  </button>
                </div>
              </div>

              {/* Live Email Results */}
              {emailResult && (
                <div className="space-y-3">
                  
                  {/* Gravatar / Avatar Banner */}
                  {emailResult.gravatarFound && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-noir-950 border border-emerald-600/50 flex items-center space-x-3 shadow-md">
                      <img
                        src={emailResult.gravatarAvatar}
                        alt="Gravatar"
                        className="w-12 h-12 rounded-xl object-cover border border-emerald-400/60 shadow-lg"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-xs font-bold text-white">Live Public Gravatar Profile Found</h4>
                        </div>
                        <p className="text-[10px] text-emerald-300 font-mono mt-0.5">
                          MD5 Hash: {emailResult.md5Hash} • Public Avatar Verified
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-noir-950/90 border border-noir-800">
                      <span className="text-[10px] text-noir-400 block uppercase">Extracted Username</span>
                      <span className="text-xs font-bold text-amber-300 font-mono mt-0.5 block truncate">
                        {emailResult.username}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-noir-950/90 border border-noir-800">
                      <span className="text-[10px] text-noir-400 block uppercase">Domain Provider</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block truncate">
                        {emailResult.domain}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-noir-950/90 border border-noir-800">
                      <span className="text-[10px] text-noir-400 block uppercase">Provider Category</span>
                      <span className="text-xs font-bold text-cyber-cyan font-mono mt-0.5 block truncate">
                        {emailResult.providerType}
                      </span>
                    </div>
                  </div>

                  {/* Direct Deep Analysis Links */}
                  <div className="bg-noir-950/90 p-4 rounded-xl border border-noir-800">
                    <h4 className="text-xs font-bold text-white uppercase mb-3 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
                      <span>Deep Identity & Data Breach Registries</span>
                    </h4>

                    <div className="space-y-2">
                      {emailResult.directIntelLinks.map((link, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-noir-900 border border-noir-800 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-white">{link.name}</span>
                            <p className="text-[10px] text-noir-400 mt-0.5">{link.desc}</p>
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-noir-800 hover:bg-cyber-cyan hover:text-noir-950 border border-noir-700 text-xs font-bold text-cyber-cyan flex items-center space-x-1.5 transition-all flex-shrink-0"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Google Dorks */}
                  <div className="bg-noir-950/90 p-4 rounded-xl border border-noir-800">
                    <h4 className="text-xs font-bold text-amber-400 uppercase mb-2">
                      Email Credential & Document Leaks Dorks
                    </h4>
                    <div className="space-y-1.5">
                      {emailResult.googleDorks.map((dork, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-noir-900 border border-noir-800 text-xs">
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
                              title="Search Google"
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

          {/* TAB 2: LIVE PROGRAMMATIC USERNAME RECON (SHERLOCK / MAIGRET STYLE) */}
          {subTab === 'username_recon' && (
            <div className="flex-1 flex flex-col overflow-y-auto space-y-4 pr-1">
              
              <div className="bg-noir-950/80 p-4 rounded-xl border border-noir-800">
                <label className="block text-xs font-bold text-cyber-cyan uppercase mb-2">
                  Live API Programmatic Username Search (Sherlock Engine):
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <UserCheck className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRunUsernameScan()}
                      placeholder="e.g. rakeshsoniiii or torvalds"
                      className="w-full bg-noir-900 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl border border-noir-700 focus:outline-none focus:border-cyber-cyan font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleRunUsernameScan()}
                    disabled={isScanningUsername}
                    className="px-4 py-2.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs shadow-neon-cyan transition-all disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isScanningUsername ? 'Querying APIs...' : 'Execute Live Scan'}</span>
                  </button>
                </div>
              </div>

              {/* Verified Live Results Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase flex items-center justify-between">
                  <span>Target Accounts ({usernameResults.length})</span>
                  <span className="text-emerald-400 text-[10px]">
                    Verified: {usernameResults.filter(r => r.status === 'FOUND').length} Active Accounts
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {usernameResults.map((acc, idx) => {
                    const isFound = acc.status === 'FOUND';
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                          isFound
                            ? 'bg-gradient-to-br from-emerald-950/40 to-noir-950 border-emerald-600/70 shadow-lg'
                            : 'bg-noir-950/80 border-noir-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-1.5">
                            <div className="flex items-center space-x-2">
                              {acc.avatar ? (
                                <img
                                  src={acc.avatar}
                                  alt="avatar"
                                  className="w-8 h-8 rounded-lg object-cover border border-white/10"
                                />
                              ) : null}
                              <div>
                                <h5 className="text-xs font-bold text-white">{acc.platform}</h5>
                                <span className="text-[10px] text-amber-300 font-mono">{acc.displayName}</span>
                              </div>
                            </div>

                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                              isFound 
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-700' 
                                : acc.status === 'NOT_FOUND' 
                                  ? 'bg-noir-900 text-noir-500 border-noir-800' 
                                  : 'bg-noir-900 text-cyber-cyan border-cyan-800'
                            }`}>
                              {isFound ? 'VERIFIED' : acc.status === 'NOT_FOUND' ? 'NOT FOUND' : 'TARGET LINK'}
                            </span>
                          </div>

                          {acc.bio && (
                            <p className="text-[10px] text-noir-300 line-clamp-2 mt-1 leading-relaxed bg-black/40 p-1.5 rounded">
                              {acc.bio}
                            </p>
                          )}
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[9px] text-noir-400">
                            {acc.location ? `📍 ${acc.location}` : acc.followers !== undefined ? `Followers: ${acc.followers}` : 'Public Profile'}
                          </span>
                          <a
                            href={acc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-cyber-cyan hover:text-white flex items-center space-x-1"
                          >
                            <span>Inspect Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: REAL FORENSIC DEVICE FINGERPRINTING (FINGERPRINT.TO / FINGERPRINT.COM STYLE) */}
          {subTab === 'fingerprint_recon' && (
            <div className="flex-1 flex flex-col overflow-y-auto space-y-4 pr-1">
              
              <div className="bg-noir-950/80 p-4 rounded-xl border border-cyber-cyan/40 shadow-lg flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-cyber-cyan uppercase mb-1 flex items-center space-x-2">
                    <Fingerprint className="w-4 h-4 text-cyber-cyan animate-pulse" />
                    <span>Real-Time Browser & Hardware Forensic Telemetry</span>
                  </h3>
                  <p className="text-[11px] text-noir-400">
                    High-entropy forensic fingerprinting matching industry standards (FingerprintJS / fingerprint.com).
                  </p>
                </div>

                <button
                  onClick={handleRunFingerprinting}
                  disabled={isFingerprinting}
                  className="px-4 py-2 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs shadow-neon-cyan transition-all flex-shrink-0"
                >
                  {isFingerprinting ? 'Analyzing Entropy...' : 'Re-calculate Fingerprint'}
                </button>
              </div>

              {deviceData && (
                <div className="space-y-3">
                  
                  {/* Visitor ID Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-noir-950 border border-cyber-cyan/50 shadow-xl">
                    <span className="text-[10px] text-noir-400 uppercase block font-bold">
                      Unique Forensic Hardware Visitor Hash
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-bold font-mono text-amber-300 tracking-wider">
                        {deviceData.visitorId}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        99.9% Entropy Confidence
                      </span>
                    </div>
                  </div>

                  {/* Hardware Attributes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    
                    <div className="p-3 rounded-xl bg-noir-950 border border-noir-800">
                      <span className="text-[10px] text-noir-400 uppercase block flex items-center space-x-1">
                        <Monitor className="w-3.5 h-3.5 text-amber-400" />
                        <span>GPU WebGL Hardware Renderer</span>
                      </span>
                      <span className="text-xs font-bold text-white font-mono mt-1 block">
                        {deviceData.webglRenderer}
                      </span>
                      <span className="text-[10px] text-noir-400 block mt-0.5">
                        Vendor: {deviceData.webglVendor}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-noir-950 border border-noir-800">
                      <span className="text-[10px] text-noir-400 uppercase block flex items-center space-x-1">
                        <HardDrive className="w-3.5 h-3.5 text-cyber-cyan" />
                        <span>CPU Cores & Device RAM</span>
                      </span>
                      <span className="text-xs font-bold text-white font-mono mt-1 block">
                        {deviceData.hardwareConcurrency} Logical CPU Cores
                      </span>
                      <span className="text-[10px] text-noir-400 block mt-0.5">
                        System Memory: {deviceData.deviceMemory}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-noir-950 border border-noir-800">
                      <span className="text-[10px] text-noir-400 uppercase block">Canvas 2D Hash</span>
                      <code className="text-xs font-bold text-amber-300 font-mono mt-1 block truncate">
                        {deviceData.canvasHash}
                      </code>
                    </div>

                    <div className="p-3 rounded-xl bg-noir-950 border border-noir-800">
                      <span className="text-[10px] text-noir-400 uppercase block">AudioContext Buffer Hash</span>
                      <code className="text-xs font-bold text-emerald-400 font-mono mt-1 block truncate">
                        {deviceData.audioHash}
                      </code>
                    </div>

                    <div className="p-3 rounded-xl bg-noir-950 border border-noir-800">
                      <span className="text-[10px] text-noir-400 uppercase block">Screen & Resolution</span>
                      <span className="text-xs font-bold text-white font-mono mt-1 block">
                        {deviceData.screenResolution} (DPR: {deviceData.pixelRatio})
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-noir-950 border border-noir-800">
                      <span className="text-[10px] text-noir-400 uppercase block">System Timezone & Language</span>
                      <span className="text-xs font-bold text-white font-mono mt-1 block">
                        {deviceData.timezone} ({deviceData.language})
                      </span>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 4: PHONE RECON (WITH 5 REVERSE NAME METHODS) */}
          {subTab === 'phone_recon' && (
            <div className="flex-1 flex flex-col overflow-y-auto space-y-4 pr-1">
              
              <div className="bg-noir-950/80 p-4 rounded-xl border border-noir-800">
                <label className="block text-xs font-bold text-cyber-cyan uppercase mb-2">
                  Enter Indian Mobile Number (10-Digits / +91) or International Number:
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
              </div>

              {phoneResult && (
                <div className="space-y-3">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-noir-950/90 border border-noir-800">
                      <span className="text-[10px] text-noir-400 block uppercase">Carrier Operator</span>
                      <span className="text-xs font-bold text-amber-300 font-mono mt-0.5 block">{phoneResult.operator}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-noir-950/90 border border-noir-800">
                      <span className="text-[10px] text-noir-400 block uppercase">Telecom Circle</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">{phoneResult.telecomCircle}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-noir-950/90 border border-noir-800">
                      <span className="text-[10px] text-noir-400 block uppercase">E.164 Format</span>
                      <span className="text-xs font-bold text-cyber-cyan font-mono mt-0.5 block">{phoneResult.e164}</span>
                    </div>
                  </div>

                  <div className="bg-noir-950/90 p-4 rounded-xl border border-amber-600/50">
                    <h4 className="text-xs font-bold text-amber-300 uppercase mb-2">5 Ways to Find the Real Registered Name:</h4>
                    <div className="space-y-2">
                      {phoneResult.nameDiscoveryMethods.map((m, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-noir-900 border border-noir-800 flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <span className="text-xs font-bold text-white block">{m.method}</span>
                            <p className="text-[10px] text-noir-400">{m.description}</p>
                          </div>
                          {m.url && (
                            <a
                              href={m.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 rounded bg-noir-800 text-cyber-cyan hover:bg-cyan-500 hover:text-noir-950 text-xs font-bold flex items-center space-x-1"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 5: LEGAL & POLICE FIR GOOGLE DORKS */}
          {subTab === 'case_dorks' && (
            <div className="flex-1 flex flex-col overflow-y-auto space-y-3 pr-1">
              <div className="bg-noir-950/80 p-3 rounded-xl border border-noir-800 mb-1">
                <span className="text-xs font-bold text-amber-400 uppercase block mb-1">
                  Active Case Research Dorks: {activeCase?.title}
                </span>
                <p className="text-[11px] text-noir-400">
                  Search Indian Kanoon, High Courts, and police department gazettes.
                </p>
              </div>

              {caseDorks.map((dork, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-noir-950/90 border border-noir-800">
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

          {/* TAB 6: CASE LOGS */}
          {subTab === 'case_intel' && (
            <div className="flex-1 flex flex-col overflow-y-auto space-y-3 pr-1">
              {osint.socialLeaks.map(leak => (
                <div key={leak.id} className="p-3.5 rounded-xl bg-noir-950/80 border border-noir-800">
                  <span className="text-xs font-bold text-cyber-cyan">{leak.target}</span>
                  <p className="text-xs text-noir-200 bg-noir-900/60 p-2.5 rounded-lg border border-white/5 my-2">
                    {leak.snippet}
                  </p>
                  <span className="text-[10px] text-amber-400">{leak.notes}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Live Multi-Vector OSINT Feed */}
        <div className="glass-panel p-4 rounded-2xl border border-noir-800 flex flex-col overflow-hidden bg-noir-950">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-noir-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Cpu className="w-4 h-4 text-cyber-cyan animate-spin-slow" />
              <span>Real-Time OSINT Console</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              LIVE
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 text-[11px] text-noir-300 font-mono pr-1 bg-black/50 p-3 rounded-xl border border-white/5">
            {terminalLogs.map((log, index) => (
              <div 
                key={index} 
                className={`${log.startsWith('>') ? 'text-amber-400 font-bold' : log.includes('[SUCCESS]') || log.includes('[COMPLETED]') ? 'text-emerald-400 font-bold' : log.includes('[PROBE]') ? 'text-cyber-cyan' : 'text-noir-400'}`}
              >
                {log}
              </div>
            ))}
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-noir-900 border border-noir-800 text-[10px] text-noir-400 flex items-center justify-between">
            <span>Engines: Sherlock • Gravatar • Fingerprint.to</span>
            <span className="text-emerald-400">Active</span>
          </div>
        </div>

      </div>

    </div>
  );
}
