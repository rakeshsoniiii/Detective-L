import React, { useState } from 'react';
import { 
  Gavel, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Flame, 
  Sparkles, 
  RotateCcw, 
  FileCheck, 
  Users,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../services/soundService';

export default function AccusationChamber({ activeCase, onCaseSolved }) {
  const [selectedSuspectId, setSelectedSuspectId] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const [selectedMotive, setSelectedMotive] = useState('');
  const [deductiveArgument, setDeductiveArgument] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdictResult, setVerdictResult] = useState(null);

  const handleSubmitIndictment = () => {
    if (!selectedSuspectId || !selectedWeapon) {
      alert("Please designate the primary suspect and murder weapon before presenting to the Grand Jury.");
      return;
    }

    soundService.playTypewriter();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const isCorrectSuspect = selectedSuspectId === activeCase.culpritId;
      const culprit = activeCase.suspects.find(s => s.id === activeCase.culpritId);

      if (isCorrectSuspect) {
        soundService.playVictory();
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        setVerdictResult({
          success: true,
          title: "GUILTY AS CHARGED!",
          culprit: culprit,
          summary: `The Grand Jury has returned a unanimous conviction against ${culprit.name}!`,
          confession: `"${activeCase.culpritId === 'suspect-marcus' ? 'Fine! Yes, I formulated the V-99! Victor was going to ruin my life and report me to the FDA! I put the slow-melting ice sphere in his private bar freezer so it would dissolve while I was in the sub-lab!' : 'You caught me... the evidence is undeniable.'}"`,
          score: 980,
          rank: "MASTER DETECTIVE L (RANK S)"
        });
        if (onCaseSolved) onCaseSolved(activeCase.id);
      } else {
        soundService.playLieDetected();
        const accused = activeCase.suspects.find(s => s.id === selectedSuspectId);
        setVerdictResult({
          success: false,
          title: "ACQUITTAL - CASE DISMISSED",
          culprit: null,
          summary: `The Grand Jury rejected the indictment against ${accused?.name}. Insufficient evidence connects them directly to the lethal mechanism.`,
          confession: null,
          score: 250,
          rank: "ROOKIE SLEUTH (RANK C)"
        });
      }
    }, 1200);
  };

  const handleReset = () => {
    soundService.playTypewriter();
    setVerdictResult(null);
    setSelectedSuspectId('');
    setSelectedWeapon('');
    setSelectedMotive('');
    setDeductiveArgument('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-4.5rem)] flex flex-col justify-between font-mono">
      
      {!verdictResult ? (
        <div className="glass-panel p-6 rounded-2xl border border-noir-800 shadow-2xl flex flex-col justify-between flex-1 overflow-y-auto">
          
          {/* Header */}
          <div>
            <div className="flex items-center space-x-3 pb-4 border-b border-noir-800 mb-6">
              <div className="p-3 rounded-xl bg-blood-600/20 text-blood-500 border border-blood-500/40">
                <Gavel className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-white">
                  Grand Jury Accusation & Arrest Warrant Chamber
                </h2>
                <p className="text-xs text-noir-400">
                  Case File: <strong className="text-amber-400">{activeCase.title}</strong> • Present the indictment to the Chief of Police.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              
              {/* 1. Select Culprit */}
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase mb-2">
                  1. Designate Primary Murder Suspect (Choose 1 of 5)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {activeCase.suspects.map(suspect => {
                    const isSelected = selectedSuspectId === suspect.id;
                    return (
                      <button
                        key={suspect.id}
                        type="button"
                        onClick={() => { soundService.playTypewriter(); setSelectedSuspectId(suspect.id); }}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center ${
                          isSelected
                            ? 'bg-blood-950 border-blood-500 shadow-neon-red ring-1 ring-blood-400'
                            : 'bg-noir-900 border-noir-800 hover:border-noir-700'
                        }`}
                      >
                        <img
                          src={suspect.avatar}
                          alt={suspect.name}
                          className="w-12 h-12 rounded-lg object-cover mb-2 border border-white/10"
                        />
                        <h4 className="text-xs font-bold text-white truncate w-full font-display">
                          {suspect.name}
                        </h4>
                        <span className="text-[9px] text-noir-400 truncate w-full">
                          {suspect.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Select Murder Weapon */}
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase mb-2">
                  2. Lethal Weapon / Toxic Delivery Method
                </label>
                <select
                  value={selectedWeapon}
                  onChange={(e) => setSelectedWeapon(e.target.value)}
                  className="w-full bg-noir-950 text-xs text-white border border-noir-700 rounded-xl p-3 focus:outline-none focus:border-blood-500"
                >
                  <option value="">-- Select Murder Weapon --</option>
                  <option value="poisoned_ice">V-99 Neurotoxin injected inside slow-melting ice sphere</option>
                  <option value="scotch_bottle">Poison poured directly into 50-year Macallan bottle</option>
                  <option value="emp_pulse">EMP neural shock pulse delivery</option>
                  <option value="blunt_force">Blunt force trauma via decanter</option>
                </select>
              </div>

              {/* 3. Primary Motive */}
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase mb-2">
                  3. Key Motive
                </label>
                <select
                  value={selectedMotive}
                  onChange={(e) => setSelectedMotive(e.target.value)}
                  className="w-full bg-noir-950 text-xs text-white border border-noir-700 rounded-xl p-3 focus:outline-none focus:border-blood-500"
                >
                  <option value="">-- Select Motive --</option>
                  <option value="whistleblower">Silencing Victor's whistleblower report regarding illegal clinical trials</option>
                  <option value="embezzlement">Covering up $34M corporate embezzlement</option>
                  <option value="inheritance">Disinherited from multi-million dollar trust</option>
                  <option value="espionage">Corporate espionage and DarkNet hardware bounties</option>
                </select>
              </div>

              {/* 4. Final Deductive Summary */}
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase mb-2">
                  4. Detective's Closing Argument
                </label>
                <textarea
                  value={deductiveArgument}
                  onChange={(e) => setDeductiveArgument(e.target.value)}
                  placeholder="Explain why the physical and digital evidence proves this suspect is the sole perpetrator beyond reasonable doubt..."
                  rows={2}
                  className="w-full bg-noir-950 text-xs text-white border border-noir-700 rounded-xl p-3 focus:outline-none focus:border-blood-500"
                />
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 pt-4 border-t border-noir-800 flex items-center justify-between">
            <span className="text-xs text-noir-400">
              * A failed indictment will require re-evaluating suspect interrogations and clues.
            </span>
            <button
              onClick={handleSubmitIndictment}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blood-600 to-blood-700 hover:from-blood-500 hover:to-blood-600 text-white font-bold text-xs shadow-neon-red transition-all flex items-center space-x-2"
            >
              <Gavel className="w-4 h-4" />
              <span>{isSubmitting ? 'Evaluating Case...' : 'Issue Arrest Warrant & Charge Suspect'}</span>
            </button>
          </div>

        </div>
      ) : (
        /* Verdict Cutscene & Score Card */
        <div className={`glass-panel p-8 rounded-2xl border shadow-2xl flex-1 flex flex-col justify-between ${
          verdictResult.success ? 'border-emerald-500/70 bg-emerald-950/20' : 'border-blood-600/70 bg-blood-950/20'
        }`}>
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <div className={`p-4 rounded-2xl ${verdictResult.success ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-blood-500/20 text-blood-400 border border-blood-500/40'}`}>
                {verdictResult.success ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
              </div>
              <div>
                <span className={`text-xs font-bold uppercase tracking-widest ${verdictResult.success ? 'text-emerald-400' : 'text-blood-400'}`}>
                  Official Courtroom Judgment
                </span>
                <h2 className="text-2xl font-bold font-display text-white">
                  {verdictResult.title}
                </h2>
              </div>
            </div>

            <p className="text-sm text-noir-200 leading-relaxed mb-6 bg-black/40 p-4 rounded-xl border border-white/10">
              {verdictResult.summary}
            </p>

            {verdictResult.confession && (
              <div className="mb-6 p-4 rounded-xl bg-blood-950/60 border border-blood-700/60">
                <span className="text-xs font-bold text-blood-400 uppercase block mb-1">Culprit's Final Confession</span>
                <p className="text-xs text-amber-200 italic font-mono leading-relaxed">
                  {verdictResult.confession}
                </p>
              </div>
            )}

            {/* Detective Rating Score */}
            <div className="grid grid-cols-2 gap-4 bg-noir-900/80 p-4 rounded-xl border border-noir-800">
              <div>
                <span className="text-[10px] text-noir-400 uppercase block">Investigation Score</span>
                <span className="text-xl font-bold text-amber-400 font-mono">{verdictResult.score} / 1000</span>
              </div>
              <div>
                <span className="text-[10px] text-noir-400 uppercase block">Detective Rank</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{verdictResult.rank}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-noir-800 hover:bg-noir-700 text-xs font-bold text-white flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{verdictResult.success ? 'Review Case Dossier' : 'Re-investigate Suspects'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
