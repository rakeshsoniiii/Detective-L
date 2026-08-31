import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Send, 
  Bot, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  MessageSquare, 
  Search, 
  FileText, 
  Lightbulb, 
  Layers, 
  FolderPlus, 
  ArrowUpRight, 
  Flame, 
  ShieldAlert,
  User,
  Radio,
  BookOpen
} from 'lucide-react';
import { chatWithDetectiveL, computeAutoConnections } from '../services/groqService';
import { deepForensicWebSearch } from '../services/liveSearchService';
import { soundService } from '../services/soundService';

export default function CaseAdvisor({ 
  activeCase, 
  onOpenCaseGenerator, 
  onDiscoverClue, 
  onApplyConnections,
  onNavigateToTab 
}) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const [liveSearchResults, setLiveSearchResults] = useState(null);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isConnectingDots, setIsConnectingDots] = useState(false);
  const [dotNotification, setDotNotification] = useState(null);

  const messagesEndRef = useRef(null);

  const discoveredClues = (activeCase?.clues || []).filter(c => c.discovered);
  const totalClues = activeCase?.clues?.length || 0;

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, liveSearchResults]);

  // Initial welcome & case briefing message on case load
  useEffect(() => {
    initCaseChat();
  }, [activeCase?.id]);

  const initCaseChat = async () => {
    soundService.playTypewriter();
    const initialGreeting = {
      id: 'msg-init',
      sender: 'ai',
      text: `### 🕵️ Detective-L Forensic Directive: "${activeCase?.title}"

**Case Dossier Initialized:**
- **Victim:** ${activeCase?.victim} (${activeCase?.victimRole})
- **Crime Scene:** ${activeCase?.location}
- **Active Evidence Memory:** **${discoveredClues.length}/${totalClues} clues discovered**.
- **Suspects Under Watch:** ${activeCase?.suspects?.length || 5} persons of interest.

I am actively tracking every clue you log, every suspect interrogation transcript, and every timeline gap. 

**Quick Commands:**
- Click **"✨ Auto-Connect Dots"** to let me calculate evidence relationships and draw forensic links on your Pinboard.
- Click **"🎯 Suggest Next Move"** for immediate tactical leads.
- Enable **"🌐 Search Reddit & Web"** to cross-reference live global discussion boards, news archives, and case theories.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([initialGreeting]);
  };

  // Send a chat message
  const handleSendMessage = async (textToSend = null, forceWebSearch = false) => {
    const query = (textToSend !== null ? textToSend : inputQuery).trim();
    if (!query || isLoading) return;

    soundService.playTypewriter();
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    let searchSources = [];
    const shouldSearchWeb = isWebSearchActive || forceWebSearch || query.toLowerCase().includes('reddit') || query.toLowerCase().includes('search') || query.toLowerCase().includes('google') || query.toLowerCase().includes('theory');

    if (shouldSearchWeb) {
      setIsSearchingWeb(true);
      try {
        const searchQuery = `${activeCase?.title} ${query}`.replace(/case|mystery|file/gi, '').trim();
        const searchResponse = await deepForensicWebSearch(searchQuery);
        searchSources = searchResponse.results || [];
        setLiveSearchResults(searchResponse);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearchingWeb(false);
      }
    }

    try {
      const aiReplyText = await chatWithDetectiveL({
        messages: newMessages,
        activeCase,
        discoveredClues,
        currentConnections: activeCase?.defaultConnections || [],
        searchResults: searchSources
      });

      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        sources: searchSources.length > 0 ? searchSources : null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      soundService.playClueFound();
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ **Forensic Analysis Alert**: ${err.message || 'Failed to reach AI reasoning core. Please verify your API key in Settings.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // One-Click Auto-Connect Dots Action
  const handleAutoConnectDots = async () => {
    soundService.playTypewriter();
    setIsConnectingDots(true);
    try {
      const res = await computeAutoConnections({
        activeCase,
        discoveredClues,
        currentConnections: activeCase?.defaultConnections || []
      });

      if (res.newConnections && res.newConnections.length > 0) {
        if (onApplyConnections) {
          onApplyConnections(res.newConnections);
        }
        soundService.playClueFound();
        setDotNotification(`✨ Connected ${res.totalCreated} new links on the Pinboard!`);
        setTimeout(() => setDotNotification(null), 4000);

        const aiDotMsg = {
          id: `msg-ai-dot-${Date.now()}`,
          sender: 'ai',
          text: `### 🧶 Auto-Connected ${res.totalCreated} Forensic Links on Pinboard

${res.explanation}

**Newly Established Hypotheses:**
${res.newConnections.map(c => `• **${c.from}** ──[${c.label}]──> **${c.to}** (Confidence: ${c.confidence}%)`).join('\n')}

🔗 *You can inspect and drag these live connection threads in the **Connect Dots** tab.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiDotMsg]);
      } else {
        setDotNotification(`All active clues are already mapped on Pinboard.`);
        setTimeout(() => setDotNotification(null), 3000);
      }
    } catch (err) {
      console.error('Auto connect error:', err);
    } finally {
      setIsConnectingDots(false);
    }
  };

  const handleCopyMessage = (text, idx) => {
    soundService.playTypewriter();
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const quickPrompts = [
    { label: "🎯 Suggest Next Move", prompt: "Based on all discovered clues and suspect statements so far, what is the highest-leverage next move I should make?" },
    { label: "⚡ Find Contradictions", prompt: "Scrutinize all 5 suspect alibis against the physical evidence and highlight the biggest timeline contradictions." },
    { label: "🔍 Search Reddit Theories", prompt: "Search Reddit discussions and community theories about this case and summarize what people believe happened.", search: true },
    { label: "📋 Evidence Summary", prompt: "Summarize all currently discovered clues and categorize them into solid proof versus circumstantial evidence." }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 h-full flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden font-mono">
      
      {/* Top Banner & Control Deck */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-noir-800 flex flex-col gap-2.5 flex-shrink-0 bg-noir-950/90 shadow-xl">
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-noir-800 pb-2.5">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blood-600/20 text-blood-500 border border-blood-500/40 flex-shrink-0">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold font-display text-white">
                  AI Forensic Director & Detective Chatbot
                </h2>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  MEMORY ACTIVE
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-noir-400">
                Case: <strong className="text-amber-400">{activeCase?.title}</strong> • Remembers all discovered clues, suspects, & live web research.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAutoConnectDots}
              disabled={isConnectingDots}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/50 text-xs font-bold transition-all shadow-sm"
              title="Automatically connect discovered clues to suspects on the Pinboard"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isConnectingDots ? 'animate-spin' : ''}`} />
              <span>{isConnectingDots ? 'Connecting...' : '✨ Auto-Connect Dots'}</span>
            </button>

            <button
              onClick={() => {
                soundService.playTypewriter();
                initCaseChat();
              }}
              className="p-1.5 rounded-xl bg-noir-900 hover:bg-noir-800 text-noir-400 hover:text-white border border-noir-800 transition-all"
              title="Reset Chat History"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenCaseGenerator}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs shadow-neon-cyan transition-all"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>New Case</span>
            </button>
          </div>
        </div>

        {/* Clue Discovery Memory Bar */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] uppercase font-bold text-noir-400 whitespace-nowrap">
              Active Memory:
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blood-950 text-blood-300 border border-blood-800 text-[10px] font-bold whitespace-nowrap">
              {discoveredClues.length}/{totalClues} Clues Found
            </span>

            {discoveredClues.slice(0, 4).map(c => (
              <button
                key={c.id}
                onClick={() => handleSendMessage(`Analyze the significance of discovered clue: "${c.title}" (${c.description})`)}
                className="px-2 py-0.5 rounded-md bg-noir-900 hover:bg-noir-800 border border-noir-800 text-[10px] text-noir-300 hover:text-white transition-all whitespace-nowrap truncate max-w-[140px]"
                title={`Ask AI about: ${c.title}`}
              >
                🔍 {c.title}
              </button>
            ))}
          </div>

          {dotNotification && (
            <span className="text-[10px] font-bold text-emerald-400 animate-pulse whitespace-nowrap bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              {dotNotification}
            </span>
          )}
        </div>

      </div>

      {/* Main Chat Stream Container */}
      <div className="flex-1 min-h-0 glass-panel p-3 sm:p-5 rounded-2xl border border-noir-800 flex flex-col justify-between overflow-hidden shadow-2xl bg-noir-950/95">
        
        {/* Messages Stream */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-2 font-mono text-xs leading-relaxed">
          
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                {/* Header Indicator */}
                <div className="flex items-center space-x-1.5 text-[10px] text-noir-400 px-1">
                  {isUser ? (
                    <>
                      <span>{msg.timestamp}</span>
                      <span className="font-bold text-blue-400">You (Lead Detective)</span>
                      <User className="w-3 h-3 text-blue-400" />
                    </>
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5 text-blood-500" />
                      <span className="font-bold text-blood-400">Detective-L Copilot</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl max-w-[92%] sm:max-w-[85%] transition-all ${
                    isUser
                      ? 'bg-blue-600/20 text-blue-100 border border-blue-500/40 shadow-lg rounded-tr-none'
                      : 'bg-noir-900/90 text-noir-200 border border-noir-800 shadow-xl rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Multi-Engine Web & Reddit Sources Citation Drawer */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-cyber-cyan flex items-center space-x-1">
                        <Globe className="w-3 h-3" />
                        <span>Sources Consulted ({msg.sources.length} Genuine Search Results):</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {msg.sources.map((s, sIdx) => (
                          <a
                            key={sIdx}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-black/50 hover:bg-black/80 border border-white/5 hover:border-cyber-cyan/40 transition-all flex items-start justify-between gap-1.5 group"
                          >
                            <div className="min-w-0">
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                                s.source === 'Reddit' 
                                  ? 'bg-orange-950 text-orange-400 border-orange-800' 
                                  : s.source === 'Wikipedia'
                                    ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                                    : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                              }`}>
                                {s.source} {s.subreddit ? `· ${s.subreddit}` : ''}
                              </span>
                              <h5 className="text-[11px] font-bold text-white group-hover:text-cyber-cyan truncate mt-1">
                                {s.title}
                              </h5>
                              <p className="text-[10px] text-noir-400 line-clamp-1 mt-0.5">
                                {s.snippet}
                              </p>
                            </div>
                            <ExternalLink className="w-3 h-3 text-noir-500 group-hover:text-white flex-shrink-0 mt-0.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Footer Actions */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-noir-500">
                      <span>Reasoned by Detective-L AI</span>
                      <button
                        onClick={() => handleCopyMessage(msg.text, idx)}
                        className="hover:text-white flex items-center space-x-1"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-amber-400 p-2 font-mono">
              <Bot className="w-4 h-4 animate-spin text-blood-500" />
              <span>
                {isSearchingWeb 
                  ? 'Searching Reddit & Web for authentic discussion threads and crime records...' 
                  : 'Synthesizing evidence memory & formulating deductive analysis...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Prompt Chips */}
        <div className="mt-2 pt-2 border-t border-noir-800/80 flex flex-wrap gap-1.5 flex-shrink-0">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qp.prompt, !!qp.search)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-noir-900 hover:bg-noir-800 border border-noir-800 hover:border-noir-700 text-[10px] text-noir-300 hover:text-white transition-all whitespace-nowrap"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Bottom Input & Web Search Toggle Bar */}
        <div className="mt-2 pt-2 border-t border-noir-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
          
          {/* Live Web & Reddit Search Toggle Button */}
          <button
            onClick={() => {
              soundService.playTypewriter();
              setIsWebSearchActive(prev => !prev);
            }}
            className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              isWebSearchActive
                ? 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/50 shadow-neon-cyan'
                : 'bg-noir-900 text-noir-400 hover:text-white border-noir-800'
            }`}
            title="When active, searches Reddit, Wikipedia, and Google for real case discussions and facts"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">
              {isWebSearchActive ? '🌐 Search: ON' : '🌐 Search: OFF'}
            </span>
          </button>

          {/* Chat Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                isWebSearchActive
                  ? "Search Reddit, Wikipedia & Web theories (e.g. 'What are real public theories on this case?')..."
                  : "Ask Detective-L (e.g. 'Who has the weakest alibi?', 'How does the weapon link to the suspect?')..."
              }
              className="w-full bg-noir-900 text-xs text-white placeholder-noir-500 pl-3.5 pr-10 py-2.5 rounded-xl border border-noir-700 focus:outline-none focus:border-blood-500 font-mono shadow-inner transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputQuery.trim()}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg bg-blood-600 hover:bg-blood-500 text-white disabled:opacity-30 transition-all shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
