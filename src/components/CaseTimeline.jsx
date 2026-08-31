import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Clock, MapPin, AlertTriangle, Eye, User, Wifi, Camera,
  ChevronLeft, ChevronRight, Zap, Shield, Radio
} from 'lucide-react';
import { soundService } from '../services/soundService';

// Parse time strings like "02:45 AM", "03:42", "01:00 - 04:00 IST" into decimal hours
function parseTimeToHours(str) {
  if (!str) return null;
  const match24 = str.match(/(\d{1,2}):(\d{2})/);
  if (match24) {
    let h = parseInt(match24[1], 10);
    let m = parseInt(match24[2], 10);
    if (str.toLowerCase().includes('pm') && h < 12) h += 12;
    if (str.toLowerCase().includes('am') && h === 12) h = 0;
    return h + m / 60;
  }
  return null;
}

function parseTimeRange(str) {
  if (!str) return { start: null, end: null };
  // Match patterns like "01:00 - 04:00" or "02:00 to 03:30"
  const rangeMatch = str.match(/(\d{1,2}:\d{2})\s*[-–to]+\s*(\d{1,2}:\d{2})/i);
  if (rangeMatch) {
    return {
      start: parseTimeToHours(rangeMatch[1] + (str.toLowerCase().includes('pm') ? ' PM' : '')),
      end: parseTimeToHours(rangeMatch[2] + (str.toLowerCase().includes('pm') ? ' PM' : ''))
    };
  }
  const single = parseTimeToHours(str);
  return { start: single, end: single ? single + 0.5 : null };
}

// Extract location mentions from text
function extractLocation(text) {
  if (!text) return 'Unknown Location';
  const locPatterns = [
    /at\s+(?:the\s+)?([A-Z][a-zA-Z\s&'-]+(?:Road|Street|Station|Hospital|Room|Hall|Gate|Wing|Ghat|Avenue|Colony|Corridor|Campus|Office|Desk|Building))/,
    /in\s+(?:the\s+)?([A-Z][a-zA-Z\s&'-]+(?:Room|Wing|Area|Section|Block|Floor))/,
    /(?:home|house|apartment|flat|residence)/i,
  ];
  for (const p of locPatterns) {
    const m = text.match(p);
    if (m) return m[1] ? m[1].trim() : m[0].trim();
  }
  // Fallback: extract first capitalized phrase
  const capMatch = text.match(/(?:at|in|near|from)\s+(?:the\s+)?([A-Z][a-zA-Z\s]{3,30})/);
  if (capMatch) return capMatch[1].trim().slice(0, 40);
  return text.slice(0, 35) + '…';
}

const SUSPECT_COLORS = [
  { bg: 'bg-blood-600', border: 'border-blood-500', text: 'text-blood-400', hex: '#dc2626' },
  { bg: 'bg-amber-600', border: 'border-amber-500', text: 'text-amber-400', hex: '#d97706' },
  { bg: 'bg-cyan-600', border: 'border-cyan-500', text: 'text-cyan-400', hex: '#0891b2' },
  { bg: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-400', hex: '#059669' },
  { bg: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-400', hex: '#9333ea' },
];

export default function CaseTimeline({ activeCase }) {
  const [currentHour, setCurrentHour] = useState(2); // Start at 02:00 (typical crime window)
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef(null);

  // Parse time of death
  const todRange = useMemo(() => parseTimeRange(activeCase.timeOfDeath), [activeCase.timeOfDeath]);

  // Build suspect alibi timeline lanes
  const suspectLanes = useMemo(() => {
    return (activeCase.suspects || []).map((suspect, idx) => {
      const alibiText = suspect.publicAlibi || '';
      const secretText = suspect.hiddenSecret || '';
      const alibiLocation = extractLocation(alibiText);
      const secretLocation = extractLocation(secretText);

      // Try to parse time from alibi; fallback to TOD window
      let alibiRange = parseTimeRange(alibiText);
      if (alibiRange.start === null) {
        alibiRange = todRange.start !== null
          ? { start: Math.max(0, todRange.start - 1), end: Math.min(24, (todRange.end || todRange.start) + 1) }
          : { start: 0, end: 6 };
      }

      // Contradiction: where evidence/secret places them
      let secretRange = parseTimeRange(secretText);
      if (secretRange.start === null && todRange.start !== null) {
        secretRange = { start: todRange.start, end: todRange.end || todRange.start + 0.5 };
      }

      const hasContradiction = alibiLocation.toLowerCase() !== secretLocation.toLowerCase() &&
        secretRange.start !== null && alibiRange.start !== null;

      return {
        suspect,
        color: SUSPECT_COLORS[idx % SUSPECT_COLORS.length],
        alibiRange,
        alibiLocation,
        secretRange,
        secretLocation,
        hasContradiction,
        isKiller: suspect.isKiller
      };
    });
  }, [activeCase.suspects, todRange]);

  // Build evidence markers from clues
  const evidenceMarkers = useMemo(() => {
    return (activeCase.clues || [])
      .filter(c => c.discovered)
      .map(clue => {
        const time = parseTimeToHours(clue.description || '') || parseTimeToHours(clue.title || '');
        return {
          clue,
          time,
          category: clue.category
        };
      })
      .filter(m => m.time !== null);
  }, [activeCase.clues]);

  // Auto-play timeline
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentHour(prev => {
          if (prev >= 23.75) {
            setIsPlaying(false);
            return 0;
          }
          return Math.round((prev + 0.25) * 100) / 100;
        });
      }, 300);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying]);

  const formatHour = (h) => {
    const hours = Math.floor(h);
    const mins = Math.round((h - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getTimePosition = (hour) => ((hour / 24) * 100);

  const isInTodWindow = (hour) => {
    if (todRange.start === null) return false;
    return hour >= todRange.start && hour <= (todRange.end || todRange.start + 1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 h-full flex-1 min-h-0 flex flex-col gap-3 overflow-hidden font-mono">

      {/* Header */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-noir-800 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-600/10 text-amber-500 border border-amber-500/30 flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold font-display text-white flex items-center space-x-2">
              <span>Crime Night Timeline</span>
              {isInTodWindow(currentHour) && (
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-blood-950 text-blood-400 border border-blood-800 animate-pulse">
                  ⚠ DEATH WINDOW
                </span>
              )}
            </h2>
            <p className="text-[11px] text-noir-400">
              TOD: <strong className="text-blood-400">{activeCase.timeOfDeath}</strong> • Scrub to reveal alibi contradictions
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentHour(prev => Math.max(0, prev - 0.25))}
            className="p-1.5 rounded-lg bg-noir-900 text-noir-300 hover:text-white border border-noir-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setIsPlaying(!isPlaying); soundService.playTypewriter(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              isPlaying
                ? 'bg-blood-600 text-white shadow-neon-red'
                : 'bg-amber-600/20 text-amber-400 border border-amber-600/40 hover:bg-amber-600/30'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span>{isPlaying ? 'SCRUBBING...' : 'AUTO-PLAY'}</span>
          </button>

          <button
            onClick={() => setCurrentHour(prev => Math.min(23.75, prev + 0.25))}
            className="p-1.5 rounded-lg bg-noir-900 text-noir-300 hover:text-white border border-noir-800 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-noir-950 border border-noir-700 text-amber-300 font-bold text-sm font-mono min-w-[70px] text-center">
            {formatHour(currentHour)}
          </div>
        </div>
      </div>

      {/* Main Timeline Area */}
      <div className="flex-1 min-h-0 overflow-y-auto glass-panel rounded-2xl border border-noir-800 p-3 sm:p-4 space-y-3">

        {/* Time Ruler */}
        <div className="relative h-10 bg-noir-950 rounded-xl border border-noir-800 overflow-hidden flex-shrink-0">
          {/* TOD highlight zone */}
          {todRange.start !== null && (
            <div
              className="absolute top-0 bottom-0 bg-blood-600/15 border-x border-blood-600/40"
              style={{
                left: `${getTimePosition(todRange.start)}%`,
                width: `${getTimePosition((todRange.end || todRange.start + 1) - todRange.start)}%`
              }}
            />
          )}

          {/* Hour markers */}
          {Array.from({ length: 25 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 flex flex-col items-center"
              style={{ left: `${getTimePosition(i)}%` }}
            >
              <div className={`w-px h-full ${i % 6 === 0 ? 'bg-noir-500' : 'bg-noir-800'}`} />
              {i % 3 === 0 && i < 24 && (
                <span className="absolute bottom-0 text-[9px] text-noir-500 font-mono -translate-x-1/2">
                  {`${i.toString().padStart(2, '0')}:00`}
                </span>
              )}
            </div>
          ))}

          {/* Current time cursor */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-cyber-cyan shadow-neon-cyan z-10 transition-all duration-200"
            style={{ left: `${getTimePosition(currentHour)}%` }}
          >
            <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-cyber-cyan border-2 border-noir-950 shadow-lg" />
          </div>

          {/* Evidence markers on ruler */}
          {evidenceMarkers.map((em, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedEvent(em); setCurrentHour(em.time); soundService.playTypewriter(); }}
              className="absolute top-1 z-20 group"
              style={{ left: `${getTimePosition(em.time)}%` }}
              title={em.clue.title}
            >
              <div className={`w-3 h-3 rounded-full border-2 border-noir-950 shadow-lg transition-transform group-hover:scale-150 ${
                em.category === 'digital' ? 'bg-cyber-cyan' :
                em.category === 'forensic' ? 'bg-blood-500' :
                em.category === 'physical' ? 'bg-amber-500' : 'bg-purple-500'
              }`} />
            </button>
          ))}
        </div>

        {/* Suspect Alibi Lanes */}
        <div className="space-y-2">
          <h3 className="text-[10px] uppercase text-noir-500 font-bold tracking-wider">
            Suspect Alibi Lanes — Red zones indicate contradictions
          </h3>

          {suspectLanes.map((lane, idx) => (
            <div key={lane.suspect.id} className="flex items-center gap-2 sm:gap-3">
              {/* Suspect Label */}
              <div className="w-32 sm:w-40 flex-shrink-0 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${lane.color.bg} flex-shrink-0`} />
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${lane.isKiller ? 'text-blood-400' : 'text-white'}`}>
                    {lane.suspect.name.split(' ')[0]}
                    {lane.isKiller && <span className="ml-1 text-[8px] text-blood-500">★</span>}
                  </p>
                  <p className="text-[9px] text-noir-500 truncate">{lane.suspect.role}</p>
                </div>
              </div>

              {/* Lane Bar */}
              <div className="flex-1 relative h-8 bg-noir-950 rounded-lg border border-noir-800 overflow-hidden">
                {/* Claimed alibi bar */}
                {lane.alibiRange.start !== null && (
                  <div
                    className={`absolute top-1 h-3 rounded-full ${lane.color.bg} opacity-60`}
                    style={{
                      left: `${getTimePosition(lane.alibiRange.start)}%`,
                      width: `${Math.max(2, getTimePosition((lane.alibiRange.end || lane.alibiRange.start + 1) - lane.alibiRange.start))}%`
                    }}
                    title={`Claims: ${lane.alibiLocation}`}
                  />
                )}

                {/* Contradiction / Secret bar */}
                {lane.hasContradiction && lane.secretRange.start !== null && (
                  <div
                    className="absolute bottom-1 h-3 rounded-full bg-blood-500/80 animate-pulse"
                    style={{
                      left: `${getTimePosition(lane.secretRange.start)}%`,
                      width: `${Math.max(2, getTimePosition((lane.secretRange.end || lane.secretRange.start + 0.5) - lane.secretRange.start))}%`
                    }}
                    title={`CONTRADICTION: Actually at ${lane.secretLocation}`}
                  />
                )}

                {/* Current time indicator */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-cyber-cyan/40 z-10 transition-all duration-200"
                  style={{ left: `${getTimePosition(currentHour)}%` }}
                />
              </div>

              {/* Status indicator */}
              <div className="w-20 flex-shrink-0 text-right">
                {lane.hasContradiction ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blood-950 text-blood-400 border border-blood-800 uppercase font-bold">
                    ⚠ FALSE
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-noir-900 text-noir-500 border border-noir-800 uppercase">
                    Alibi
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] text-noir-400 pt-2 border-t border-noir-800">
          <div className="flex items-center space-x-1.5">
            <div className="w-6 h-2 rounded bg-gradient-to-r from-amber-600/60 to-amber-600/60" />
            <span>Claimed Alibi Position</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-6 h-2 rounded bg-blood-500/80 animate-pulse" />
            <span>Contradiction / True Position</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-cyber-cyan border border-noir-950" />
            <span>Digital Evidence</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-blood-500 border border-noir-950" />
            <span>Forensic Evidence</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500 border border-noir-950" />
            <span>Physical Evidence</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-6 h-3 rounded bg-blood-600/15 border border-blood-600/40" />
            <span>Time of Death Window</span>
          </div>
        </div>

        {/* Contradiction Alerts */}
        {suspectLanes.filter(l => l.hasContradiction).length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-blood-400 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>TIMELINE CONTRADICTIONS DETECTED</span>
            </h3>
            {suspectLanes.filter(l => l.hasContradiction).map((lane) => (
              <div
                key={lane.suspect.id}
                className="p-3 rounded-xl bg-blood-950/40 border border-blood-800/50 text-xs space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${lane.isKiller ? 'text-blood-400' : 'text-white'}`}>
                    {lane.suspect.name}
                  </span>
                  {lane.isKiller && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blood-600 text-white uppercase font-bold">
                      PRIME SUSPECT
                    </span>
                  )}
                </div>
                <p className="text-noir-300">
                  <span className="text-amber-400">Claims:</span> "{lane.alibiLocation}"
                </p>
                <p className="text-noir-300">
                  <span className="text-blood-400">Evidence shows:</span> "{lane.secretLocation}"
                </p>
                <p className="text-noir-500 text-[10px] italic">
                  {lane.suspect.vulnerabilities}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Selected Evidence Detail */}
        {selectedEvent && (
          <div className="p-3 rounded-xl bg-cyber-cyan/5 border border-cyber-cyan/30 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-cyber-cyan">{selectedEvent.clue.title}</h4>
              <button onClick={() => setSelectedEvent(null)} className="text-noir-500 hover:text-white text-xs">✕</button>
            </div>
            <p className="text-noir-300">{selectedEvent.clue.description}</p>
            <p className="text-amber-400 text-[10px]">Significance: {selectedEvent.clue.significance}</p>
          </div>
        )}
      </div>

      {/* Time Slider */}
      <div className="flex-shrink-0 glass-panel rounded-xl border border-noir-800 p-3">
        <input
          type="range"
          min="0"
          max="23.75"
          step="0.25"
          value={currentHour}
          onChange={(e) => setCurrentHour(parseFloat(e.target.value))}
          className="w-full h-2 bg-noir-800 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
        />
        <div className="flex justify-between text-[9px] text-noir-500 mt-1 font-mono">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
      </div>
    </div>
  );
}
