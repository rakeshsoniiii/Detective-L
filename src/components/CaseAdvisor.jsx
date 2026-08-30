import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  FileText, 
  Send, 
  Bot, 
  ListChecks, 
  Radio, 
  FolderPlus,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { consultDetectiveL } from '../services/groqService';
import { soundService } from '../services/soundService';

export default function CaseAdvisor({ activeCase, onOpenCaseGenerator }) {
  const [analysisText, setAnalysisText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchCaseBriefing = async () => {
    soundService.playTypewriter();
    setIsLoading(true);
    try {
      const prompt = `CRIME INVESTIGATION ANALYSIS REQUEST:
Analyze the active case: "${activeCase.title}".
VICTIMS: ${activeCase.victim}
LOCATION: ${activeCase.location}
CRIME DETAILS: ${activeCase.crimeDetails}
SUSPECTS UNDER SCRUTINY:
${activeCase.suspects.map(s => `- ${s.name} (${s.role}): Public Alibi: "${s.publicAlibi}"`).join('\n')}

CURRENT EVIDENCE LOGGED:
${activeCase.clues.map(c => `- [${c.category.toUpperCase()}] ${c.title}: ${c.description}`).join('\n')}

GENERATE A RIGOROUS INVESTIGATIVE REPORT WITH THESE 4 SECTIONS:
1. 📋 VERIFIED CASE FACTS ("What You Know with Certainty")
2. ⚠️ CRITICAL INVESTIGATIVE GAPS ("What You Need / What Is Missing")
3. 🎯 HIGH-PRIORITY WITNESS & SUSPECT CROSS-EXAMINATION TARGETS
4. 🔍 RECOMMENDED NEXT ACTION (CCTV, CDR tower dumps, forensics, or OSINT lookups)`;

      const result = await consultDetectiveL({
        caseData: activeCase,
        clues: activeCase.clues,
        connections: activeCase.defaultConnections,
        currentQuestion: prompt
      });

      setAnalysisText(result);
      soundService.playClueFound();
    } catch (e) {
      console.error(e);
      setAnalysisText("Failed to generate AI case briefing. Please check your Groq API key.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseBriefing();
  }, [activeCase.id]);

  const handleAskQuestion = async () => {
    if (!customQuery.trim()) return;
    soundService.playTypewriter();
    setIsLoading(true);
    try {
      const result = await consultDetectiveL({
        caseData: activeCase,
        clues: activeCase.clues,
        connections: activeCase.defaultConnections,
        currentQuestion: customQuery
      });
      setAnalysisText(prev => `${prev}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🕵️ USER QUERY: "${customQuery}"\n\n${result}`);
      setCustomQuery('');
      soundService.playClueFound();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    soundService.playTypewriter();
    navigator.clipboard.writeText(analysisText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 h-[calc(100vh-4.5rem)] flex flex-col gap-4 font-mono">
      
      {/* Top Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-noir-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blood-600/20 text-blood-500 border border-blood-500/40">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold font-display text-white">
                AI Investigation Director & Case Gap Analyzer
              </h2>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-blood-950 text-blood-400 border border-blood-800">
                REAL FORENSIC SYNTHESIZER
              </span>
            </div>
            <p className="text-xs text-noir-400">
              Active Case: <strong className="text-amber-400">{activeCase.title}</strong> • Direct synthesis of known evidence vs missing leads.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchCaseBriefing}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-noir-900 hover:bg-noir-800 text-xs text-amber-300 border border-noir-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Analyze Case</span>
          </button>

          <button
            onClick={onOpenCaseGenerator}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-noir-950 font-bold text-xs shadow-neon-cyan transition-all"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Start New Real Case</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Display */}
      <div className="flex-1 glass-panel p-6 rounded-2xl border border-noir-800 flex flex-col justify-between overflow-hidden shadow-2xl bg-noir-950">
        
        {/* Analysis Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-xs leading-relaxed text-noir-200">
          {isLoading && !analysisText ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 text-amber-400">
              <Bot className="w-8 h-8 animate-spin text-blood-500" />
              <p className="text-xs">Groq AI is synthesizing known facts, timeline contradictions, and forensic gaps...</p>
            </div>
          ) : (
            <div className="bg-black/50 p-5 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed">
              {analysisText}
            </div>
          )}
        </div>

        {/* Input Question Bar */}
        <div className="mt-4 pt-3 border-t border-noir-800 flex items-center space-x-2">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
            placeholder="Ask the AI Director: e.g. 'What is the biggest contradiction in Bikram Shastri's alibi?'..."
            className="flex-1 bg-noir-900 text-xs text-white placeholder-noir-500 px-4 py-2.5 rounded-xl border border-noir-700 focus:outline-none focus:border-blood-500 font-mono"
          />
          <button
            onClick={handleAskQuestion}
            disabled={isLoading || !customQuery.trim()}
            className="p-2.5 rounded-xl bg-blood-600 hover:bg-blood-500 text-white disabled:opacity-40 shadow-neon-red transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-noir-900 hover:bg-noir-800 text-noir-300 border border-noir-700 transition-all"
            title="Copy Report"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

      </div>

    </div>
  );
}
