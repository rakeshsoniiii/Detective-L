import React, { useState } from 'react';
import { 
  Camera, 
  Search, 
  Sparkles, 
  Eye, 
  Lightbulb, 
  Fingerprint, 
  CheckCircle2, 
  ShieldAlert, 
  ZoomIn, 
  Maximize2,
  FolderPlus
} from 'lucide-react';
import { soundService } from '../services/soundService';

export default function CrimeScene({ activeCase, onDiscoverClue }) {
  const [selectedTool, setSelectedTool] = useState('magnifier'); // 'magnifier', 'uv', 'fingerprint'
  const [inspectedHotspot, setInspectedHotspot] = useState(null);
  const [discoveredHotspots, setDiscoveredHotspots] = useState([]);

  const scene = activeCase.crimeScene || {
    backgroundImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
    description: "The primary crime scene.",
    hotspots: []
  };

  const handleHotspotClick = (hotspot) => {
    soundService.playCameraShutter();
    setInspectedHotspot(hotspot);

    if (!discoveredHotspots.includes(hotspot.id)) {
      setDiscoveredHotspots(prev => [...prev, hotspot.id]);
      soundService.playClueFound();
      if (onDiscoverClue && hotspot.clueId) {
        onDiscoverClue(hotspot.clueId);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 h-full flex-1 min-h-0 flex flex-col gap-3 overflow-hidden font-mono">
      
      {/* Crime Scene Top Bar */}
      <div className="glass-panel p-3 rounded-2xl border border-noir-800 flex flex-wrap items-center justify-between gap-2 sm:gap-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex-shrink-0">
            <Camera className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display text-white flex items-center space-x-2">
              <span>Crime Scene Investigation Field</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-blood-950 text-blood-400 border border-blood-800">
                SCENE PRESERVED
              </span>
            </h2>
            <p className="text-[11px] text-noir-400">
              {scene.description}
            </p>
          </div>
        </div>

        {/* Forensic Lens Mode Selector */}
        <div className="flex items-center space-x-1 bg-noir-900 p-1 rounded-xl border border-noir-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'magnifier', label: 'Optical Loupe', icon: Search },
            { id: 'uv', label: 'UV Luminol Spray', icon: Lightbulb },
            { id: 'fingerprint', label: 'Latent Dusting', icon: Fingerprint },
          ].map(t => {
            const Icon = t.icon;
            const active = selectedTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  soundService.playTypewriter();
                  setSelectedTool(t.id);
                }}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? t.id === 'uv' 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : t.id === 'fingerprint' 
                        ? 'bg-cyber-cyan text-noir-950 shadow-neon-cyan' 
                        : 'bg-amber-500 text-noir-950 shadow-neon-amber'
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

      {/* Main Crime Scene Viewport */}
      <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden border border-noir-800 shadow-2xl bg-black">
        
        {/* Background Crime Scene Image */}
        <img
          src={scene.backgroundImage}
          alt="Crime Scene"
          className={`w-full h-full object-cover select-none transition-all duration-700 ${
            selectedTool === 'uv' 
              ? 'filter invert brightness-50 contrast-200 hue-rotate-180 saturate-200' 
              : selectedTool === 'fingerprint' 
                ? 'filter grayscale contrast-150' 
                : 'filter brightness-90'
          }`}
        />

        {/* UV Luminol Glowing Overlay */}
        {selectedTool === 'uv' && (
          <div className="absolute inset-0 bg-purple-950/30 mix-blend-color-dodge pointer-events-none animate-pulse-slow">
            <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-cyan-400/20 filter blur-xl"></div>
          </div>
        )}

        {/* Hotspots Layer */}
        {scene.hotspots.map((hotspot) => {
          const isDiscovered = discoveredHotspots.includes(hotspot.id);

          return (
            <button
              key={hotspot.id}
              onClick={() => handleHotspotClick(hotspot)}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none"
            >
              {/* Pulsing Hotspot Radar Ring */}
              <div className="relative flex items-center justify-center">
                <span className={`animate-ping absolute inline-flex h-12 w-12 rounded-full opacity-75 ${
                  selectedTool === 'uv' ? 'bg-purple-500' : 'bg-blood-500'
                }`}></span>
                
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-2xl ${
                  isDiscovered 
                    ? 'bg-emerald-600/90 border-emerald-300 text-white' 
                    : 'bg-blood-600/90 border-amber-300 text-white animate-pulse'
                }`}>
                  {isDiscovered ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </div>

                {/* Hover Label */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-noir-950/95 border border-amber-500/60 px-2.5 py-1 rounded-lg text-[11px] text-amber-300 shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                  {hotspot.name}
                </div>
              </div>
            </button>
          );
        })}

        {/* Bottom Status Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="bg-noir-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-noir-700 text-xs text-noir-300 flex items-center space-x-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Hotspots Discovered: <strong>{discoveredHotspots.length} / {scene.hotspots.length}</strong></span>
          </div>

          <div className="bg-noir-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-noir-700 text-xs text-amber-400">
            Mode: <strong className="uppercase">{selectedTool}</strong>
          </div>
        </div>

      </div>

      {/* Hotspot Inspection Modal */}
      {inspectedHotspot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel-amber p-6 rounded-2xl border border-amber-600/60 shadow-2xl">
            <div className="flex items-center justify-between border-b border-amber-800/80 pb-2 mb-3">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold font-display text-white">
                  Forensic Evidence Tag: {inspectedHotspot.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectedHotspot(null)}
                className="text-xs text-noir-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-noir-200 leading-relaxed bg-black/50 p-4 rounded-xl border border-white/5 mb-4">
              {inspectedHotspot.discoveredText}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Clue automatically filed to Evidence Locker & Pinboard!</span>
              </span>

              <button
                onClick={() => setInspectedHotspot(null)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-noir-950 font-bold text-xs"
              >
                Continue Sweep
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
