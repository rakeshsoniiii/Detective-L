import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Send, 
  Heart, 
  Activity, 
  ShieldAlert, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  Eye, 
  HelpCircle, 
  FileSearch, 
  Bot, 
  CheckCircle2, 
  Lock, 
  BrainCircuit,
  CornerDownRight
} from 'lucide-react';
import { interrogateSuspect, consultDetectiveL } from '../services/groqService';
import { soundService } from '../services/soundService';

export default function InterrogationRoom({ activeCase, onDiscoverClue }) {
  const [selectedSuspectId, setSelectedSuspectId] = useState(activeCase.suspects[0]?.id);
  const [chatHistories, setChatHistories] = useState({});
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClueToConfront, setSelectedClueToConfront] = useState(null);
  const [isConfrontModalOpen, setIsConfrontModalOpen] = useState(false);
  
  // Suspect Live Telemetry State
  const [suspectTelemetries, setSuspectTelemetries] = useState({});
  
  // L Copilot State
  const [isLConsulting, setIsLConsulting] = useState(false);
  const [lAdvice, setLAdvice] = useState('');
  const [isLDrawerOpen, setIsLDrawerOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const currentSuspect = activeCase.suspects.find(s => s.id === selectedSuspectId) || activeCase.suspects[0];
  const currentChat = chatHistories[selectedSuspectId] || [
    {
      id: 'init-1',
      sender: 'suspect',
      content: `Detective. I am here cooperating voluntarily. What is this about? My alibi is on record: ${currentSuspect.publicAlibi}`,
      timestamp: 'Now',
      telltaleSign: 'Sits rigidly, hands folded on table'
    }
  ];

  const currentTelemetry = suspectTelemetries[selectedSuspectId] || {
    stress: 30,
    bpm: 76,
    emotion: 'Guarded',
    suspicion: 40,
    lastTell: 'Maintains steady eye contact'
  };

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat, isLoading]);

  // Periodic heartbeat sound if stress is high
  useEffect(() => {
    if (currentTelemetry.bpm > 105) {
      const interval = setInterval(() => {
        soundService.playHeartbeat(currentTelemetry.bpm);
      }, (60 / currentTelemetry.bpm) * 1000);
      return () => clearInterval(interval);
    }
  }, [currentTelemetry.bpm]);

  const handleSelectSuspect = (suspectId) => {
    soundService.playTypewriter();
    setSelectedSuspectId(suspectId);
    setSelectedClueToConfront(null);
  };

  const handleSendMessage = async (customText = null, clue = null) => {
    const question = customText || inputText;
    if (!question.trim() && !clue) return;

    soundService.playTypewriter();

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'detective',
      content: question,
      confrontedClue: clue ? clue.title : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...currentChat, newMsg];
    setChatHistories(prev => ({
      ...prev,
      [selectedSuspectId]: updatedHistory
    }));
    setInputText('');
    setSelectedClueToConfront(null);
    setIsConfrontModalOpen(false);
    setIsLoading(true);

    try {
      const response = await interrogateSuspect({
        caseData: activeCase,
        suspect: currentSuspect,
        chatHistory: updatedHistory,
        userQuestion: question,
        confrontedClue: clue,
        currentStress: currentTelemetry.stress
      });

      const newStress = Math.max(10, Math.min(100, currentTelemetry.stress + response.stressDelta));
      
      if (response.stressDelta > 12) {
        soundService.playLieDetected();
      } else {
        soundService.playTypewriter();
      }

      setSuspectTelemetries(prev => ({
        ...prev,
        [selectedSuspectId]: {
          stress: newStress,
          bpm: response.heartRateBpm,
          emotion: response.emotionalState,
          suspicion: response.suspicionRating,
          lastTell: response.telltaleSign
        }
      }));

      const replyMsg = {
        id: `reply-${Date.now()}`,
        sender: 'suspect',
        content: response.dialogue,
        telltaleSign: response.telltaleSign,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistories(prev => ({
        ...prev,
        [selectedSuspectId]: [...updatedHistory, replyMsg]
      }));

    } catch (e) {
      console.error('Interrogation error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Consult L
  const handleConsultL = async () => {
    soundService.playTypewriter();
    setIsLConsulting(true);
    setIsLDrawerOpen(true);
    try {
      const advice = await consultDetectiveL({
        caseData: activeCase,
        clues: activeCase.clues.filter(c => c.discovered),
        connections: activeCase.defaultConnections,
        currentQuestion: `Analyzing suspect ${currentSuspect.name} (${currentSuspect.role}). Public Alibi: "${currentSuspect.publicAlibi}". What is their weakness?`
      });
      setLAdvice(advice);
      soundService.playClueFound();
    } catch (err) {
      setLAdvice("Scrutinize the time stamps between 22:45 and 23:15. One of the suspects is lying about their physical proximity to the victim's study.");
    } finally {
      setIsLConsulting(false);
    }
  };

  // Quick Questions
  const quickQuestions = [
    `Where exactly were you at ${activeCase.timeOfDeath}?`,
    `What was your true financial and personal relationship with ${activeCase.victim}?`,
    `We found inconsistent security logs. Are you willing to explain?`,
    `Did you see anyone near the 84th floor study between 22:30 and 23:30?`
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 h-full flex-1 min-h-0 flex flex-col lg:flex-row gap-3 overflow-hidden">
      
      {/* LEFT COLUMN: 5-Suspect Matrix & Biometric HUD */}
      <div className="w-full lg:w-80 flex flex-col gap-2.5 flex-shrink-0 min-h-0 max-h-full overflow-y-auto pr-1">
        
        {/* Suspect Selector Cards */}
        <div className="glass-panel p-3 rounded-2xl border border-noir-800 flex flex-col flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-white flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-blood-500" />
              <span>Suspect Matrix (5)</span>
            </span>
            <span className="text-[10px] font-mono text-noir-400 bg-noir-900 px-2 py-0.5 rounded border border-noir-800">
              Holding Cells
            </span>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-48 lg:max-h-60 pr-1">
            {activeCase.suspects.map((suspect) => {
              const isSelected = suspect.id === selectedSuspectId;
              const telemetry = suspectTelemetries[suspect.id] || { stress: 30, suspicion: 40 };

              return (
                <button
                  key={suspect.id}
                  onClick={() => handleSelectSuspect(suspect.id)}
                  className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-blood-950/70 border border-blood-600 text-white shadow-neon-red'
                      : 'bg-noir-900/60 hover:bg-noir-850 border border-noir-800 text-noir-300'
                  }`}
                >
                  <img
                    src={suspect.avatar}
                    alt={suspect.name}
                    className="w-10 h-10 rounded-lg object-cover border border-white/10 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold truncate font-display text-white">
                        {suspect.name}
                      </h4>
                      <span className={`text-[9px] font-mono font-bold ${
                        telemetry.stress > 70 ? 'text-blood-400' : 'text-amber-400'
                      }`}>
                        {telemetry.stress}% STRESS
                      </span>
                    </div>
                    <p className="text-[10px] text-noir-400 font-mono truncate">
                      {suspect.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Biometric & Lie Detector HUD */}
        <div className="glass-panel-danger p-4 rounded-2xl border border-blood-700/50 shadow-xl flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-blood-900/80 pb-2 mb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blood-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Lie-Detector Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blood-950 text-blood-400 border border-blood-800">
                LIVE SENSORS
              </span>
            </div>

            {/* Heart Rate BPM Indicator */}
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5 mb-3">
              <div className="flex items-center space-x-2.5">
                <div className={`p-2 rounded-lg ${currentTelemetry.bpm > 100 ? 'bg-blood-900/60 text-blood-400 animate-bounce' : 'bg-noir-900 text-noir-400'}`}>
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-noir-400 block uppercase">Cardiac Pulse</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-bold font-mono text-white tracking-tight">
                      {currentTelemetry.bpm}
                    </span>
                    <span className="text-[10px] font-mono text-blood-400">BPM</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] font-mono text-noir-400 block uppercase">Emotional State</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                  currentTelemetry.stress > 65
                    ? 'bg-blood-950 text-blood-400 border-blood-700'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {currentTelemetry.emotion}
                </span>
              </div>
            </div>

            {/* Stress Level Meter */}
            <div className="mb-3">
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-noir-400">Psychological Stress Barometer</span>
                <span className="font-bold text-amber-400">{currentTelemetry.stress}%</span>
              </div>
              <div className="w-full h-2.5 bg-noir-900 rounded-full overflow-hidden border border-noir-800">
                <div 
                  className={`h-full transition-all duration-700 ${
                    currentTelemetry.stress > 70 
                      ? 'bg-gradient-to-r from-amber-500 to-blood-600 shadow-neon-red' 
                      : 'bg-gradient-to-r from-emerald-500 to-amber-500'
                  }`}
                  style={{ width: `${currentTelemetry.stress}%` }}
                />
              </div>
            </div>

            {/* Micro-Expression & Tell */}
            <div className="bg-noir-900/80 p-2.5 rounded-xl border border-noir-800">
              <span className="text-[10px] font-mono text-amber-400 flex items-center space-x-1 mb-1">
                <Eye className="w-3 h-3" />
                <span className="uppercase">Observed Tell</span>
              </span>
              <p className="text-xs font-mono text-noir-200 italic">
                "{currentTelemetry.lastTell}"
              </p>
            </div>
          </div>

          {/* L Copilot Button */}
          <button
            onClick={handleConsultL}
            disabled={isLConsulting}
            className="mt-3 w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-gradient-to-r from-noir-900 via-noir-850 to-noir-900 hover:from-blood-950 hover:to-noir-900 border border-blood-600/40 text-xs font-mono text-amber-300 hover:text-white transition-all shadow-md"
          >
            <BrainCircuit className="w-4 h-4 text-blood-400 animate-pulse" />
            <span>{isLConsulting ? 'L is analyzing contradictions...' : 'Ask "L" for Interrogation Insight'}</span>
          </button>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive Interrogation Console */}
      <div className="flex-1 min-h-0 glass-panel rounded-2xl border border-noir-800 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Terminal Header */}
        <div className="p-3 sm:p-3.5 border-b border-noir-800 bg-noir-950/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              <img
                src={currentSuspect.avatar}
                alt={currentSuspect.name}
                className="w-9 h-9 rounded-lg object-cover border border-blood-500/50"
              />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-noir-950 animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white font-display">
                  {currentSuspect.name}
                </h3>
                <span className="text-[10px] font-mono text-noir-400">
                  ({currentSuspect.age} yrs, {currentSuspect.role})
                </span>
              </div>
              <p className="text-[11px] font-mono text-amber-400/90 truncate max-w-md">
                Stated Alibi: "{currentSuspect.publicAlibi}"
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => setIsConfrontModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blood-600 hover:bg-blood-500 text-xs font-mono text-white font-bold shadow-neon-red transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Confront Evidence</span>
            </button>
          </div>
        </div>

        {/* Live Conversation Stream */}
        <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto space-y-3 bg-noir-950/50 font-mono">
          {currentChat.map((msg) => {
            const isDetective = msg.sender === 'detective';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isDetective ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${
                    isDetective ? 'text-amber-400' : 'text-blood-400'
                  }`}>
                    {isDetective ? 'Detective Rakesh Soni' : currentSuspect.name}
                  </span>
                  <span className="text-[9px] text-noir-400">{msg.timestamp}</span>
                </div>

                {msg.confrontedClue && (
                  <div className="mb-1 bg-blood-950/90 border border-blood-600/80 px-2.5 py-1 rounded-lg text-[10px] text-amber-300 flex items-center space-x-1.5">
                    <ShieldAlert className="w-3 h-3 text-blood-400" />
                    <span>Confronted with Clue: <strong>{msg.confrontedClue}</strong></span>
                  </div>
                )}

                <div className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isDetective
                    ? 'bg-gradient-to-br from-noir-850 to-noir-800 text-white border border-noir-700 shadow-md'
                    : 'bg-gradient-to-br from-blood-950/50 to-noir-900 text-noir-100 border border-blood-800/60 shadow-md'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.telltaleSign && (
                    <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-amber-400/80 italic flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span>[{msg.telltaleSign}]</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs font-mono text-blood-400 bg-blood-950/30 p-3 rounded-xl border border-blood-800/40 w-fit">
              <Bot className="w-4 h-4 animate-spin text-blood-500" />
              <span>Suspect is hesitating... analyzing cognitive response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Prompts Bar */}
        <div className="px-3 py-2 bg-noir-950 border-t border-noir-800/80 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-noir-400 uppercase flex-shrink-0">Tactics:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(q)}
              className="flex-shrink-0 px-2.5 py-1 rounded bg-noir-900 hover:bg-noir-800 text-noir-300 hover:text-white border border-noir-800 text-[11px] font-mono transition-all"
            >
              {q.length > 38 ? q.substring(0, 36) + '...' : q}
            </button>
          ))}
        </div>

        {/* Interrogation Input Bar */}
        <div className="p-3 bg-noir-900 border-t border-noir-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage();
              }
            }}
            placeholder={`Question ${currentSuspect.name} directly...`}
            disabled={isLoading}
            className="flex-1 bg-noir-950 text-xs font-mono text-white placeholder-noir-400 px-4 py-2.5 rounded-xl border border-noir-700 focus:outline-none focus:border-blood-500 transition-all"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 rounded-xl bg-blood-600 hover:bg-blood-500 disabled:opacity-40 text-white shadow-neon-red transition-all flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Confront Clue Modal */}
      {isConfrontModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel-danger p-6 rounded-2xl border border-blood-600/60 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-blood-800/80 pb-2">
              <h3 className="text-base font-bold font-display text-white flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-blood-500" />
                <span>Confront {currentSuspect.name} with Evidence</span>
              </h3>
              <button
                onClick={() => setIsConfrontModalOpen(false)}
                className="text-xs font-mono text-noir-400 hover:text-white"
              >
                Close [ESC]
              </button>
            </div>

            <p className="text-xs font-mono text-noir-300 mb-3">
              Select a discovered physical, forensic, or digital clue from your evidence locker to press the suspect for confessions or contradictions:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 mb-4">
              {activeCase.clues.filter(c => c.discovered).map((clue) => (
                <button
                  key={clue.id}
                  onClick={() => setSelectedClueToConfront(clue)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-start space-x-3 ${
                    selectedClueToConfront?.id === clue.id
                      ? 'bg-blood-950 border border-blood-500 shadow-neon-red text-white'
                      : 'bg-noir-900/80 hover:bg-noir-850 border border-noir-800 text-noir-300'
                  }`}
                >
                  <FileSearch className="w-4 h-4 text-blood-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white font-mono">{clue.title}</h4>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-noir-950 text-amber-400 border border-noir-700">
                        {clue.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-noir-400 font-mono mt-1 line-clamp-2">
                      {clue.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsConfrontModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-noir-800 text-xs font-mono text-noir-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={!selectedClueToConfront}
                onClick={() => handleSendMessage(`Explain this: We have recovered the ${selectedClueToConfront?.title}!`, selectedClueToConfront)}
                className="px-4 py-2 rounded-lg bg-blood-600 hover:bg-blood-500 disabled:opacity-40 text-xs font-mono text-white font-bold shadow-neon-red"
              >
                Confront Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "L" Detective Insight Modal / Drawer */}
      {isLDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl glass-panel p-6 rounded-2xl border border-blood-600/70 shadow-2xl">
            <div className="flex items-center justify-between border-b border-noir-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blood-600 flex items-center justify-center font-display font-black text-white text-base">
                  L
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-white">
                    L's Analytical Deduction
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400">
                    Master Detective Strategic Advisor
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsLDrawerOpen(false)}
                className="text-xs font-mono text-noir-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="bg-noir-950 p-4 rounded-xl border border-noir-800 font-mono text-xs text-noir-200 leading-relaxed space-y-2">
              {isLConsulting ? (
                <div className="flex items-center space-x-2 text-amber-400">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>L is synthesizing timelines, phone logs, and psychological profiles...</span>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{lAdvice}</p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsLDrawerOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-noir-800 hover:bg-noir-700 text-xs font-mono text-white"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
