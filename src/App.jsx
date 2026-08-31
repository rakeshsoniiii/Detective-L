import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Pinboard from './components/Pinboard';
import InterrogationRoom from './components/InterrogationRoom';
import CrimeScene from './components/CrimeScene';
import OsintLab from './components/OsintLab';
import EvidenceLocker from './components/EvidenceLocker';
import AccusationChamber from './components/AccusationChamber';
import CaseGeneratorModal from './components/CaseGeneratorModal';
import ApiKeyModal from './components/ApiKeyModal';
import CaseAdvisor from './components/CaseAdvisor';
import { INITIAL_CASES } from './data/cases';

export default function App() {
  const [cases, setCases] = useState(() => {
    const saved = localStorage.getItem('detective_l_cases_v2');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [activeCaseId, setActiveCaseId] = useState(() => {
    return cases[0]?.id || 'case-stoneman-kolkata';
  });

  const [currentTab, setCurrentTab] = useState('advisor');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isCaseGenModalOpen, setIsCaseGenModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [solvedCaseIds, setSolvedCaseIds] = useState([]);

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  // Save cases to localStorage
  useEffect(() => {
    localStorage.setItem('detective_l_cases_v2', JSON.stringify(cases));
  }, [cases]);

  // Discover a Clue
  const handleDiscoverClue = (clueId) => {
    setCases(prevCases => prevCases.map(c => {
      if (c.id === activeCaseId) {
        return {
          ...c,
          clues: c.clues.map(clue => clue.id === clueId ? { ...clue, discovered: true } : clue)
        };
      }
      return c;
    }));
  };

  // Handle Deduction Breakthrough
  const handleSolveDeduction = (deductionType) => {
    if (deductionType === 'toxin_delivery') {
      handleDiscoverClue('clue-vermilion-cloth');
    }
    if (deductionType === 'alibi_shattered') {
      handleDiscoverClue('clue-sealdah-patrol-log');
    }
  };

  // Handle Case Solved
  const handleCaseSolved = (caseId) => {
    if (!solvedCaseIds.includes(caseId)) {
      setSolvedCaseIds(prev => [...prev, caseId]);
    }
    setCases(prevCases => prevCases.map(c => c.id === caseId ? { ...c, status: 'SOLVED' } : c));
  };

  // Add newly generated AI case
  const handleCaseCreated = (newCase) => {
    setCases(prev => [newCase, ...prev]);
    setActiveCaseId(newCase.id);
    setCurrentTab('advisor');
  };

  // Handle Auto-Connecting Dots from AI Advisor
  const handleApplyAutoConnections = (newConnections) => {
    if (!newConnections || newConnections.length === 0) return;
    
    setCases(prevCases => prevCases.map(c => {
      if (c.id === activeCaseId) {
        const existing = c.defaultConnections || [];
        const existingKeys = new Set(existing.map(e => `${e.from}->${e.to}`));
        const filteredNew = newConnections.filter(n => !existingKeys.has(`${n.from}->${n.to}`));
        return {
          ...c,
          defaultConnections: [...existing, ...filteredNew]
        };
      }
      return c;
    }));

    // Unlock forensic breakthroughs if matching evidence was connected
    newConnections.forEach(conn => {
      if (conn.from?.includes('cloth') || conn.to?.includes('cloth') || conn.from?.includes('syrup')) {
        handleSolveDeduction('toxin_delivery');
      }
      if (conn.from?.includes('patrol') || conn.to?.includes('patrol') || conn.from?.includes('log')) {
        handleSolveDeduction('alibi_shattered');
      }
    });
  };

  return (
    <div className="h-screen w-full bg-noir-950 text-noir-100 flex flex-col overflow-hidden selection:bg-blood-600 selection:text-white">
      
      {/* Top Header Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeCase={activeCase}
        cases={cases}
        setActiveCaseId={setActiveCaseId}
        onOpenCaseGenerator={() => setIsCaseGenModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        isAudioMuted={isAudioMuted}
        setIsAudioMuted={setIsAudioMuted}
        solvedCount={solvedCaseIds.length}
      />

      {/* Main Tab Viewports */}
      <main className="flex-1 min-h-0 w-full relative overflow-hidden flex flex-col">
        {currentTab === 'advisor' && (
          <CaseAdvisor
            activeCase={activeCase}
            onOpenCaseGenerator={() => setIsCaseGenModalOpen(true)}
            onDiscoverClue={handleDiscoverClue}
            onApplyConnections={handleApplyAutoConnections}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'pinboard' && (
          <Pinboard
            activeCase={activeCase}
            onDiscoverClue={handleDiscoverClue}
            onSolveDeduction={handleSolveDeduction}
          />
        )}

        {currentTab === 'interrogate' && (
          <InterrogationRoom
            activeCase={activeCase}
            onDiscoverClue={handleDiscoverClue}
          />
        )}

        {currentTab === 'crimescene' && (
          <CrimeScene
            activeCase={activeCase}
            onDiscoverClue={handleDiscoverClue}
          />
        )}

        {currentTab === 'osint' && (
          <OsintLab
            activeCase={activeCase}
            onDiscoverClue={handleDiscoverClue}
          />
        )}

        {currentTab === 'evidence' && (
          <EvidenceLocker
            activeCase={activeCase}
            onDiscoverClue={handleDiscoverClue}
          />
        )}

        {currentTab === 'verdict' && (
          <AccusationChamber
            activeCase={activeCase}
            onCaseSolved={handleCaseSolved}
          />
        )}
      </main>

      {/* AI Mystery Generator Modal */}
      <CaseGeneratorModal
        isOpen={isCaseGenModalOpen}
        onClose={() => setIsCaseGenModalOpen(false)}
        onCaseCreated={handleCaseCreated}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

    </div>
  );
}
