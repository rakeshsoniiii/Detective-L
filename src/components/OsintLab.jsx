import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Smartphone, 
  UserCheck, 
  FileText, 
  Copy, 
  Check, 
  User, 
  Fingerprint, 
  ArrowUpRight, 
  Sparkles, 
  Image as ImageIcon,
  Download,
  CreditCard,
  MessageCircle,
  Server
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { generateCaseDorks } from '../services/osintToolsService';
import { scanLiveUsername, scanLiveEmail, scanLivePhone } from '../services/realOsintScanner';

export default function OsintLab({ activeCase, onDiscoverClue }) {
  // Search Mode: 'username' | 'email' | 'phone' | 'dorks'
  const [searchMode, setSearchMode] = useState('username');
  const [inputQuery, setInputQuery] = useState('bikramkapali');
  const [isScanning, setIsScanning] = useState(false);
  
  // Results State
  const [usernameScanResult, setUsernameScanResult] = useState(null);
  const [emailScanResult, setEmailScanResult] = useState(null);
  const [phoneScanResult, setPhoneScanResult] = useState(null);
  
  // Filtering & Search within results
  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [copiedText, setCopiedText] = useState('');
  const [expandedCardIds, setExpandedCardIds] = useState({});

  const caseDorks = generateCaseDorks(activeCase?.title, activeCase?.victim, activeCase?.location);

  // Auto-run initial demo search on mount
  useEffect(() => {
    handleRunSearch('bikramkapali', 'username');
  }, []);

  const handleRunSearch = async (queryToUse = null, modeToUse = null) => {
    const q = (queryToUse !== null ? queryToUse : inputQuery).trim();
    const mode = modeToUse || searchMode;
    if (!q) return;

    soundService.playTypewriter();
    setIsScanning(true);
    setFilterQuery('');
    setCategoryFilter('ALL');

    try {
      if (mode === 'username') {
        const result = await scanLiveUsername(q);
        setUsernameScanResult(result);
        soundService.playClueFound();
      } else if (mode === 'email') {
        const result = await scanLiveEmail(q);
        setEmailScanResult(result);
        soundService.playClueFound();
      } else if (mode === 'phone') {
        const result = await scanLivePhone(q, activeCase);
        setPhoneScanResult(result);
        soundService.playClueFound();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopy = (text) => {
    soundService.playTypewriter();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 1500);
  };

  const toggleExpandCard = (id) => {
    soundService.playTypewriter();
    setExpandedCardIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportJson = () => {
    soundService.playTypewriter();
    const dataToExport = searchMode === 'username' 
      ? usernameScanResult 
      : searchMode === 'email' 
        ? emailScanResult 
        : phoneScanResult;
    
    if (!dataToExport) return;
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osint_report_${inputQuery.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get active result dataset based on mode
  const activeResult = searchMode === 'username' 
    ? usernameScanResult 
    : searchMode === 'email' 
      ? emailScanResult 
      : searchMode === 'phone'
        ? phoneScanResult
        : null;

  const rawProfiles = activeResult?.profiles || [];

  // Filter profiles
  const filteredProfiles = rawProfiles.filter(p => {
    const matchesFilterText = !filterQuery || 
      p.platform.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (p.displayName && p.displayName.toLowerCase().includes(filterQuery.toLowerCase())) ||
      (p.bio && p.bio.toLowerCase().includes(filterQuery.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(filterQuery.toLowerCase()));

    if (!matchesFilterText) return false;

    if (categoryFilter === 'ALL') return true;
    if (categoryFilter === 'FOUND') return p.status === 'FOUND';
    return p.category?.toUpperCase() === categoryFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 h-full flex-1 min-h-0 flex flex-col gap-3 overflow-hidden font-mono">
      
      {/* Top Header & Search Bar (Fingerprint.to Style) */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-noir-800 flex flex-col gap-3 flex-shrink-0 bg-noir-950/90 shadow-xl">
        
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-noir-800/80 pb-3">
          <div className="flex items-center space-x-1.5 bg-noir-900 p-1 rounded-xl border border-noir-800">
            <button
              onClick={() => {
                soundService.playTypewriter();
                setSearchMode('username');
                if (!inputQuery.includes('@') && !inputQuery.startsWith('+') && !/^\d+$/.test(inputQuery)) {
                  handleRunSearch(inputQuery || 'bikramkapali', 'username');
                } else {
                  setInputQuery('bikramkapali');
                  handleRunSearch('bikramkapali', 'username');
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                searchMode === 'username' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-noir-300 hover:text-white hover:bg-noir-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>@ Username</span>
            </button>

            <button
              onClick={() => {
                soundService.playTypewriter();
                setSearchMode('email');
                if (inputQuery.includes('@')) {
                  handleRunSearch(inputQuery, 'email');
                } else {
                  setInputQuery('target.investigation@gmail.com');
                  handleRunSearch('target.investigation@gmail.com', 'email');
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                searchMode === 'email' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-noir-300 hover:text-white hover:bg-noir-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>✉ Email</span>
            </button>

            <button
              onClick={() => {
                soundService.playTypewriter();
                setSearchMode('phone');
                if (inputQuery.startsWith('+') || /^\d+$/.test(inputQuery.replace(/\s+/g, ''))) {
                  handleRunSearch(inputQuery, 'phone');
                } else {
                  setInputQuery('+91 9830123456');
                  handleRunSearch('+91 9830123456', 'phone');
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                searchMode === 'phone' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-noir-300 hover:text-white hover:bg-noir-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📞 Phone OSINT</span>
            </button>

            <button
              onClick={() => {
                soundService.playTypewriter();
                setSearchMode('dorks');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                searchMode === 'dorks' 
                  ? 'bg-amber-600 text-noir-950 font-bold shadow-lg' 
                  : 'text-noir-300 hover:text-white hover:bg-noir-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>⚖️ Case Legal Dorks</span>
            </button>
          </div>

          {/* Suspect Shortcuts for active case */}
          {activeCase?.suspects && activeCase.suspects.length > 0 && (
            <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-noir-400">
              <span className="font-mono text-amber-400 font-bold">Suspect Shortcuts:</span>
              {activeCase.suspects.slice(0, 3).map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (searchMode === 'phone' && s.phone) {
                      setInputQuery(s.phone);
                      handleRunSearch(s.phone, 'phone');
                    } else {
                      const handle = s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                      setInputQuery(handle);
                      setSearchMode('username');
                      handleRunSearch(handle, 'username');
                    }
                  }}
                  className="px-2 py-0.5 rounded bg-noir-900 hover:bg-blood-950 border border-noir-800 hover:border-blood-600 text-noir-300 hover:text-white transition-all truncate max-w-[120px]"
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input Box */}
        {searchMode !== 'dorks' && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-noir-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunSearch()}
                placeholder={
                  searchMode === 'username' 
                    ? "Enter target handle (e.g. torvalds, satyanadella, alex_dev)..." 
                    : searchMode === 'email' 
                      ? "Enter target email (e.g. suspect.target@gmail.com)..." 
                      : "Enter phone number (e.g. +91 9830123456 or 9820012345)..."
                }
                className="w-full bg-noir-900/90 text-sm text-white placeholder-noir-500 pl-10 pr-4 py-2.5 rounded-xl border border-noir-700 focus:outline-none focus:border-blue-500 font-mono shadow-inner transition-all"
              />
            </div>

            <button
              onClick={() => handleRunSearch()}
              disabled={isScanning || !inputQuery.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg transition-all flex-shrink-0"
            >
              {isScanning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto space-y-3 pr-1">
        
        {/* ================= SCAN RESULTS (USERNAME, EMAIL, PHONE) ================= */}
        {searchMode !== 'dorks' && activeResult && (
          <>
            {/* Stats Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-noir-400 font-mono">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">
                  {activeResult.foundCount} verified profiles found
                </span>
                <span>·</span>
                <span className="text-noir-400">{activeResult.scanDuration}s</span>
              </div>
              <div className="text-noir-400 text-[11px]">
                First seen <strong className="text-amber-400">{activeResult.firstSeen}</strong> · Last seen <strong className="text-emerald-400">{activeResult.lastSeen}</strong>
              </div>
            </div>

            {/* Bento Intelligence Overview (Matching Fingerprint.to Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Bento 1: Profile Pictures */}
              <div className="glass-panel p-3.5 rounded-2xl border border-noir-800 flex flex-col justify-between bg-noir-950/80">
                <div className="flex items-center justify-between text-xs text-noir-400 mb-2">
                  <span className="flex items-center space-x-1.5 font-bold text-white">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Profile pictures ({activeResult.aggregated?.profilePictures?.length || 0})</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
                  {activeResult.aggregated?.profilePictures && activeResult.aggregated.profilePictures.length > 0 ? (
                    activeResult.aggregated.profilePictures.map((pic, idx) => (
                      <img
                        key={idx}
                        src={pic}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-noir-700 hover:border-blue-500 shadow-md flex-shrink-0 transition-transform hover:scale-110"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ))
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-noir-900 border border-noir-800 flex items-center justify-center text-noir-600">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Bento 2: Discovered Names & Aliases (Resolved Real Name) */}
              <div className="glass-panel p-3.5 rounded-2xl border border-noir-800 flex flex-col justify-between bg-noir-950/80">
                <div className="flex items-center justify-between text-xs text-noir-400 mb-2">
                  <span className="flex items-center space-x-1.5 font-bold text-white">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Names ({activeResult.aggregated?.names?.length || 0})</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
                  {activeResult.aggregated?.names && activeResult.aggregated.names.length > 0 ? (
                    activeResult.aggregated.names.map((name, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-noir-900 border border-noir-800 text-[11px] text-amber-300 font-bold"
                      >
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-noir-500">None detected</span>
                  )}
                </div>
              </div>

              {/* Bento 3: Geographic Locations */}
              <div className="glass-panel p-3.5 rounded-2xl border border-noir-800 flex flex-col justify-between bg-noir-950/80">
                <div className="flex items-center justify-between text-xs text-noir-400 mb-2">
                  <span className="flex items-center space-x-1.5 font-bold text-white">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Locations ({activeResult.aggregated?.locations?.length || 0})</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
                  {activeResult.aggregated?.locations && activeResult.aggregated.locations.length > 0 ? (
                    activeResult.aggregated.locations.map((loc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/80 text-[11px] text-emerald-300"
                      >
                        {loc}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-noir-500">Unspecified in public records</span>
                  )}
                </div>
              </div>

              {/* Bento 4: Usernames / Identity Handles / Phone Identifiers */}
              <div className="glass-panel p-3.5 rounded-2xl border border-noir-800 flex flex-col justify-between bg-noir-950/80">
                <div className="flex items-center justify-between text-xs text-noir-400 mb-2">
                  <span className="flex items-center space-x-1.5 font-bold text-white">
                    <Fingerprint className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Identifiers ({activeResult.aggregated?.usernames?.length || 0})</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
                  {activeResult.aggregated?.usernames && activeResult.aggregated.usernames.length > 0 ? (
                    activeResult.aggregated.usernames.map((u, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/80 text-[11px] text-cyber-cyan font-mono font-bold"
                      >
                        {u.startsWith('+') || u.includes('@') ? u : '@' + u}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-noir-500">{inputQuery}</span>
                  )}
                </div>
              </div>

            </div>

            {/* PHONE-SPECIFIC TELECOM & LEGAL NAME DISCOVERY PANEL */}
            {searchMode === 'phone' && activeResult.phoneDetails && (
              <div className="glass-panel p-4 rounded-2xl border border-emerald-900/60 bg-emerald-950/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                      Official Spectrum Node & Registered Subscriber Overview
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {activeResult.phoneDetails.e164} · <span className="text-amber-300">{activeResult.aggregated?.names?.[0] || 'Registered User'}</span>
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-noir-900 text-amber-300 border border-noir-700">
                      OPERATOR: {activeResult.phoneDetails.operator}
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-noir-900 text-emerald-400 border border-noir-700">
                      CIRCLE: {activeResult.phoneDetails.telecomCircle}
                    </span>
                  </div>
                </div>

                {/* 1-Click Verification & Discovery Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                  {activeResult.phoneDetails.nameDiscoveryMethods?.map((method, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-noir-950/80 border border-noir-800 flex flex-col justify-between">
                      <div className="mb-2">
                        <span className="text-xs font-bold text-white block truncate">{method.method}</span>
                        <p className="text-[10px] text-noir-400 line-clamp-2 mt-0.5">{method.description}</p>
                      </div>
                      {method.url && (
                        <a
                          href={method.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-noir-950 font-bold text-[10px] flex items-center justify-center space-x-1 transition-all"
                        >
                          <span>{method.actionLabel}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {/* UPI Banking VPA Copy Chips */}
                {activeResult.phoneDetails.possibleUPIVPAs && (
                  <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-noir-400 font-bold uppercase">NPCI Banking VPAs:</span>
                    {activeResult.phoneDetails.possibleUPIVPAs.map((vpa, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCopy(vpa)}
                        className="px-2 py-0.5 rounded bg-noir-900 hover:bg-noir-800 border border-noir-700 text-[10px] text-amber-300 font-mono flex items-center space-x-1"
                      >
                        <span>{vpa}</span>
                        {copiedText === vpa ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-noir-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Email-Specific Direct Intelligence Tools Bar */}
            {searchMode === 'email' && activeResult.directIntelTools && (
              <div className="glass-panel p-4 rounded-2xl border border-blue-900/60 bg-blue-950/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white uppercase">Direct Live Email Verification Tools</span>
                  </div>
                  <span className="text-[10px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    PROVIDER: {activeResult.providerName}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {activeResult.directIntelTools.map((tool, idx) => (
                    <a
                      key={idx}
                      href={tool.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-noir-950/80 hover:bg-noir-900 border border-noir-800 hover:border-blue-500 transition-all flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-noir-400 group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-[10px] text-noir-400 leading-tight line-clamp-2">
                        {tool.desc}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Filter & Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-noir-900/80 p-2.5 rounded-xl border border-noir-800">
              <div className="flex items-center space-x-2 flex-1 min-w-[200px] max-w-md">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-noir-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Filter results..."
                    className="w-full bg-noir-950 text-xs text-white placeholder-noir-500 pl-8 pr-3 py-1.5 rounded-lg border border-noir-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
                  {['ALL', 'FOUND', 'DEVELOPER', 'SOCIAL', 'TELECOM', 'IDENTITY'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                        categoryFilter === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-noir-950 text-noir-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-noir-400 font-mono">
                  <strong>{filteredProfiles.length}</strong> found
                </span>
                <button
                  onClick={handleExportJson}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-noir-950 hover:bg-noir-800 border border-noir-800 text-xs text-noir-200 hover:text-white transition-all font-mono"
                  title="Export full intelligence report as JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Platform Results Grid (Fingerprint.to Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProfiles.map((p) => {
                const isFound = p.status === 'FOUND';
                const isExpanded = !!expandedCardIds[p.id];

                return (
                  <div
                    key={p.id}
                    className={`glass-panel p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isFound 
                        ? 'border-noir-700 bg-noir-950/90 hover:border-blue-500 shadow-lg' 
                        : 'border-noir-850 bg-noir-950/40 opacity-80 hover:opacity-100 hover:border-noir-700'
                    }`}
                  >
                    <div>
                      {/* Platform Card Header */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1.5 rounded-lg ${isFound ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-noir-900 text-noir-400 border border-noir-800'}`}>
                            {p.icon === 'phone' ? <Phone className="w-3.5 h-3.5" /> :
                             p.icon === 'message-circle' ? <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> :
                             p.icon === 'credit-card' ? <CreditCard className="w-3.5 h-3.5 text-amber-400" /> :
                             p.icon === 'server' ? <Server className="w-3.5 h-3.5 text-cyan-400" /> :
                             <Globe className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-white hover:text-blue-400 flex items-center space-x-1 uppercase tracking-wider font-display"
                            >
                              <span>{p.platform}</span>
                              <ExternalLink className="w-3 h-3 text-noir-400" />
                            </a>
                          </div>
                        </div>

                        <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${
                          isFound
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-noir-900 text-noir-400 border-noir-800'
                        }`}>
                          {isFound ? 'FOUND' : 'VERIFIED LINK'}
                        </span>
                      </div>

                      {/* Profile Details */}
                      <div className="flex items-start space-x-3 mb-2.5">
                        {p.avatar ? (
                          <img
                            src={p.avatar}
                            alt={p.displayName}
                            className="w-10 h-10 rounded-xl object-cover border border-noir-700 shadow-inner flex-shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-noir-900 border border-noir-800 flex items-center justify-center text-noir-500 flex-shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate font-display">
                            {p.displayName || p.handle}
                          </h4>
                          <span className="text-[10px] text-blue-400 font-mono block truncate">
                            {p.handle}
                          </span>
                          {p.location && (
                            <span className="text-[10px] text-noir-400 font-mono flex items-center space-x-1 mt-0.5 truncate">
                              <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                              <span>{p.location}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bio Snippet */}
                      {p.bio && (
                        <p className="text-[11px] text-noir-300 font-mono leading-relaxed bg-black/40 p-2 rounded-lg border border-white/5 line-clamp-2 mb-2">
                          {p.bio}
                        </p>
                      )}

                      {/* Metadata Chips */}
                      <div className="flex flex-wrap gap-2 text-[10px] font-mono text-noir-400 my-1">
                        {p.followers !== undefined && (
                          <span><strong>{p.followers}</strong></span>
                        )}
                        {p.joinedDate && (
                          <span>Status: <strong className="text-amber-300">{p.joinedDate}</strong></span>
                        )}
                        {p.lastActive && (
                          <span>Network: <strong className="text-emerald-300">{p.lastActive}</strong></span>
                        )}
                      </div>

                      {/* Expandable Key-Value Fields */}
                      {isExpanded && p.extraFields && p.extraFields.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/5 space-y-1 text-[10px] font-mono">
                          {p.extraFields.map((f, i) => (
                            <div key={i} className="flex justify-between py-0.5 text-noir-300">
                              <span className="text-noir-500">{f.label}:</span>
                              <span className="text-white font-bold truncate max-w-[180px]">{String(f.value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                      {p.extraFields && p.extraFields.length > 0 ? (
                        <button
                          onClick={() => toggleExpandCard(p.id)}
                          className="text-[10px] text-blue-400 hover:text-white transition-colors"
                        >
                          {isExpanded ? 'Hide fields ▲' : `+${p.extraFields.length} more fields ▼`}
                        </button>
                      ) : (
                        <span className="text-[10px] text-noir-600">Profile verified</span>
                      )}

                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-noir-900 hover:bg-blue-600 hover:text-white border border-noir-800 text-[10px] text-blue-400 transition-all flex items-center space-x-1"
                      >
                        <span>Open Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ================= LEGAL CASE DORKS TAB ================= */}
        {searchMode === 'dorks' && (
          <div className="space-y-4">
            <div className="glass-panel p-4 rounded-2xl border border-amber-600/40 bg-amber-950/20 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-display flex items-center space-x-2">
                  <span>Legal Research & Court Dork Engine</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                    CASE: {activeCase?.title}
                  </span>
                </h3>
                <p className="text-xs text-noir-400 mt-0.5">
                  Direct search links into Indian Kanoon, High Courts, Supreme Court, Gazette FIRs, and Archive.org.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {caseDorks.map((dork, i) => (
                <div key={i} className="glass-panel p-4 rounded-2xl border border-noir-800 bg-noir-950/90 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-white font-display">{dork.title}</h4>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleCopy(dork.query)}
                          className="text-[10px] text-noir-400 hover:text-white px-2 py-0.5 rounded bg-noir-900 border border-noir-800 flex items-center space-x-1"
                        >
                          {copiedText === dork.query ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-noir-500" />}
                          <span>Copy</span>
                        </button>
                        <a
                          href={dork.query.startsWith('http') ? dork.query : `https://www.google.com/search?q=${encodeURIComponent(dork.query)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-noir-950 font-bold flex items-center space-x-1 transition-all"
                        >
                          <span>Execute Dork</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-noir-400 mb-2 leading-relaxed">{dork.description}</p>
                  </div>
                  <code className="text-xs text-amber-300 bg-noir-900 p-2.5 rounded-xl block break-all font-mono border border-white/5">
                    {dork.query}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
