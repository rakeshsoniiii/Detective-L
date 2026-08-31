import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Zap, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Info, 
  Link2, 
  Layers, 
  Flame, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { soundService } from '../services/soundService';

export default function Pinboard({ activeCase, onDiscoverClue, onSolveDeduction }) {
  const containerRef = useRef(null);

  // Nodes state (suspects + discovered clues + custom notes)
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [connectingFromId, setConnectingFromId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [customNoteText, setCustomNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [nodeOffset, setNodeOffset] = useState({ x: 0, y: 0 });
  const [deductionsUnlocked, setDeductionsUnlocked] = useState([]);

  // Synchronize case data into pinboard nodes
  useEffect(() => {
    const suspectNodes = activeCase.suspects.map((s, index) => ({
      id: s.id,
      title: s.name,
      subtitle: s.role,
      category: 'suspect',
      avatar: s.avatar,
      x: 30 + (index % 4) * 240,
      y: 25 + Math.floor(index / 4) * 240,
      details: s.publicAlibi
    }));

    const clueNodes = activeCase.clues
      .filter(c => c.discovered)
      .map((c, index) => ({
        id: c.id,
        title: c.title,
        subtitle: c.category.toUpperCase(),
        category: c.category,
        x: c.x || (40 + (index % 4) * 240),
        y: c.y || (270 + Math.floor(index / 4) * 220),
        details: c.description
      }));

    setNodes([...suspectNodes, ...clueNodes]);
    setConnections(activeCase.defaultConnections || []);
    setDeductionsUnlocked([]);
  }, [activeCase]);

  // Handle Dragging Node
  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setNodeOffset({
        x: (e.clientX / zoomLevel) - node.x,
        y: (e.clientY / zoomLevel) - node.y
      });
    }
  };

  const handleCanvasMouseDown = (e) => {
    if (e.target === containerRef.current || e.target.tagName === 'svg') {
      setIsDraggingCanvas(true);
      setDragStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y
      });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (draggedNodeId) {
      const newX = (e.clientX / zoomLevel) - nodeOffset.x;
      const newY = (e.clientY / zoomLevel) - nodeOffset.y;
      setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: Math.max(10, newX), y: Math.max(10, newY) } : n));
    } else if (isDraggingCanvas) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggedNodeId(null);
    setIsDraggingCanvas(false);
  };

  const handleWheel = (e) => {
    const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoomLevel(z => Math.max(0.5, Math.min(1.5, parseFloat((z + zoomDelta).toFixed(2)))));
  };

  // Node Connection (Draw Red Yarn)
  const handleNodeClick = (nodeId) => {
    soundService.playTypewriter();
    if (!connectingFromId) {
      setConnectingFromId(nodeId);
      setSelectedNodeId(nodeId);
    } else if (connectingFromId === nodeId) {
      setConnectingFromId(null);
    } else {
      // Connect two nodes
      const exists = connections.some(
        c => (c.from === connectingFromId && c.to === nodeId) || (c.from === nodeId && c.to === connectingFromId)
      );

      if (!exists) {
        soundService.playStringConnect();
        const newConn = {
          id: `conn-${Date.now()}`,
          from: connectingFromId,
          to: nodeId,
          label: "Linked Lead"
        };
        const updatedConnections = [...connections, newConn];
        setConnections(updatedConnections);

        // Check if deduction unlocked
        checkDeductions(updatedConnections);
      }
      setConnectingFromId(null);
    }
  };

  // Auto-Deduction Engine
  const checkDeductions = (conns) => {
    if (!activeCase) return;

    // Condition 1: Dr. Marcus Vance connected to poisoned tumbler & cryo access
    const marcusTumbler = conns.some(c => (c.from === 'suspect-marcus' && c.to === 'clue-whiskey-glass') || (c.from === 'clue-whiskey-glass' && c.to === 'suspect-marcus'));
    const marcusFreezer = conns.some(c => (c.from === 'suspect-marcus' && c.to === 'clue-freezer-log') || (c.from === 'clue-freezer-log' && c.to === 'suspect-marcus'));
    
    if (marcusTumbler && !deductionsUnlocked.includes('toxin_delivery')) {
      setDeductionsUnlocked(prev => [...prev, 'toxin_delivery']);
      soundService.playClueFound();
      if (onSolveDeduction) onSolveDeduction('toxin_delivery');
    }

    if (marcusFreezer && !deductionsUnlocked.includes('alibi_shattered')) {
      setDeductionsUnlocked(prev => [...prev, 'alibi_shattered']);
      soundService.playLieDetected();
      if (onSolveDeduction) onSolveDeduction('alibi_shattered');
    }
  };

  // Delete Connection
  const handleDeleteConnection = (connId) => {
    soundService.playTypewriter();
    setConnections(prev => prev.filter(c => c.id !== connId));
  };

  // Edit Connection Label
  const handleEditConnectionLabel = (connId) => {
    const current = connections.find(c => c.id === connId);
    const newLabel = prompt("Enter connection hypothesis note (e.g., 'Alibi Contradiction', 'Motive Link', 'DNA Match'):", current?.label || '');
    if (newLabel !== null && newLabel.trim() !== '') {
      soundService.playTypewriter();
      setConnections(prev => prev.map(c => c.id === connId ? { ...c, label: newLabel.trim() } : c));
    }
  };

  // Add Custom Detective Note
  const handleAddCustomNote = () => {
    if (!customNoteText.trim()) return;
    soundService.playTypewriter();
    const newNote = {
      id: `note-${Date.now()}`,
      title: "Detective's Note",
      subtitle: "OBSERVATION",
      category: "note",
      x: 300 + Math.random() * 100,
      y: 200 + Math.random() * 100,
      details: customNoteText.trim()
    };
    setNodes(prev => [...prev, newNote]);
    setCustomNoteText('');
    setIsAddingNote(false);
  };

  const filteredNodes = nodes.filter(n => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'suspect') return n.category === 'suspect';
    if (filterCategory === 'clue') return n.category !== 'suspect' && n.category !== 'note';
    if (filterCategory === 'notes') return n.category === 'note';
    return true;
  });

  return (
    <div className="relative w-full h-full flex-1 min-h-0 overflow-hidden flex flex-col bg-noir-950">
      
      {/* Top Toolbar */}
      <div className="z-20 flex flex-wrap items-center justify-between px-3 py-2 sm:p-3 glass-panel border-b border-noir-800/80 bg-noir-950/90 flex-shrink-0 gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1 bg-noir-900 p-1 rounded-lg border border-noir-800">
            <span className="text-[11px] sm:text-xs font-mono text-noir-400 px-1 sm:px-2">Filter:</span>
            {['all', 'suspect', 'clue', 'notes'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-[11px] sm:text-xs uppercase font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded ${
                  filterCategory === cat
                    ? 'bg-blood-600 text-white font-bold'
                    : 'text-noir-300 hover:bg-noir-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-noir-700 hidden sm:block"></div>

          {/* Quick instructions / status */}
          <div className="hidden xl:flex items-center space-x-2 text-xs font-mono text-amber-400/90 bg-amber-950/30 px-3 py-1 rounded-lg border border-amber-800/40">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>Click one card, then another to string together red leads. Drag cards to organize.</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddingNote(true)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-noir-850 hover:bg-noir-800 text-xs font-mono text-amber-400 border border-amber-700/40 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Detective Pin</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 bg-noir-900 p-0.5 sm:p-1 rounded-lg border border-noir-800">
            <button
              onClick={() => setZoomLevel(z => Math.max(0.6, z - 0.1))}
              className="p-1 text-noir-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-noir-400 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(z => Math.min(1.5, z + 0.1))}
              className="p-1 text-noir-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
              className="p-1 text-noir-400 hover:text-white"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Deduction Alert Banner */}
      {deductionsUnlocked.length > 0 && (
        <div className="z-10 bg-gradient-to-r from-blood-950 via-amber-950 to-noir-950 border-b border-blood-600/50 px-4 py-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-blood-400">
            <Flame className="w-4 h-4 text-blood-500 animate-bounce" />
            <span className="font-bold text-white uppercase tracking-wider">Breakthrough Deduction:</span>
            <span className="text-amber-300">
              {deductionsUnlocked.includes('alibi_shattered') 
                ? "Dr. Marcus Vance's sub-level cryo-vault access directly contradicts his 20:00 alibi!" 
                : "The V-99 neurotoxin was disguised inside the slow-melting ice sphere!"}
            </span>
          </div>
          <span className="bg-blood-600/30 text-blood-300 px-2 py-0.5 rounded border border-blood-500/40 text-[10px]">
            +250 Sleuth XP
          </span>
        </div>
      )}

      {/* Main Corkboard Interactive Canvas */}
      <div 
        ref={containerRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onWheel={handleWheel}
        className={`relative flex-1 w-full h-full corkboard-bg overflow-hidden select-none ${
          isDraggingCanvas ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: 'top left'
        }}
      >
        {/* SVG Canvas for Red Yarn Strings */}
        <svg className="absolute inset-0 w-[3000px] h-[3000px] pointer-events-none z-0">
          <defs>
            <filter id="string-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.8"/>
            </filter>
          </defs>

          {connections.map((conn) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            // Card center approximation
            const x1 = fromNode.x + 105;
            const y1 = fromNode.y + 70;
            const x2 = toNode.x + 105;
            const y2 = toNode.y + 70;

            // Curved bezier path for natural dangling yarn look
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 + Math.min(60, Math.hypot(x2 - x1, y2 - y1) * 0.15);
            const pathData = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

            return (
              <g key={conn.id} className="pointer-events-auto cursor-pointer group">
                {/* Yarn background glow */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#string-glow)"
                  className="transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:stroke-amber-400"
                />
                
                {/* Relationship Tag Label */}
                <foreignObject
                  x={midX - 70}
                  y={midY - 14}
                  width="140"
                  height="30"
                  className="overflow-visible"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditConnectionLabel(conn.id);
                      }}
                      className="px-2 py-0.5 bg-noir-950/95 border border-blood-600/80 rounded shadow-md text-[10px] font-mono text-amber-300 whitespace-nowrap hover:bg-blood-950 hover:border-amber-400 transition-all flex items-center space-x-1"
                    >
                      <Link2 className="w-2.5 h-2.5 text-blood-400" />
                      <span>{conn.label}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConnection(conn.id);
                      }}
                      className="p-0.5 bg-blood-950 border border-blood-700 text-blood-400 hover:text-white rounded text-[9px]"
                      title="Cut String"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer (Suspects, Clues, Notes) */}
        {filteredNodes.map((node) => {
          const isSuspect = node.category === 'suspect';
          const isNote = node.category === 'note';
          const isConnecting = connectingFromId === node.id;
          const isSelected = selectedNodeId === node.id;

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onClick={() => handleNodeClick(node.id)}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
              className={`absolute z-10 w-52 p-3 rounded-xl cursor-move transition-shadow duration-200 ${
                isSuspect 
                  ? 'glass-panel-danger border-blood-600/70 shadow-lg' 
                  : isNote 
                    ? 'glass-panel-amber border-amber-500/70' 
                    : 'glass-panel-cyan border-cyber-cyan/50'
              } ${
                isConnecting ? 'ring-2 ring-amber-400 shadow-neon-amber animate-pulse' : ''
              } ${
                isSelected ? 'ring-1 ring-white' : ''
              }`}
            >
              {/* Pushpin at the top */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-blood-500 to-amber-600 border-2 border-noir-950 shadow-md flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>

              {/* Card Header */}
              <div className="flex items-start space-x-2.5 mt-1">
                {isSuspect && node.avatar ? (
                  <img
                    src={node.avatar}
                    alt={node.title}
                    className="w-10 h-10 rounded-lg object-cover border border-blood-500/40 shadow-inner flex-shrink-0"
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isNote ? 'bg-amber-950/80 text-amber-400 border border-amber-700/50' : 'bg-cyan-950/80 text-cyber-cyan border border-cyan-700/50'
                  }`}>
                    {isNote ? <Info className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-mono uppercase tracking-wider block font-bold text-noir-400">
                    {node.subtitle}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate font-display">
                    {node.title}
                  </h4>
                </div>
              </div>

              {/* Card Body Details */}
              <p className="mt-2 text-[10px] text-noir-300 font-mono line-clamp-3 leading-relaxed bg-black/40 p-1.5 rounded border border-white/5">
                {node.details}
              </p>

              {/* Card Footer Actions */}
              <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between">
                <span className={`text-[9px] font-mono font-medium ${
                  isConnecting ? 'text-amber-400 font-bold' : 'text-noir-400'
                }`}>
                  {isConnecting ? 'Select 2nd pin...' : 'Click to link'}
                </span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(node.id);
                  }}
                  className="p-1 rounded bg-noir-900 hover:bg-blood-900 text-blood-400 hover:text-white transition-all text-[10px]"
                  title="Connect String"
                >
                  <Link2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Note Modal */}
      {isAddingNote && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel-amber p-6 rounded-2xl border border-amber-600/50 shadow-2xl">
            <h3 className="text-base font-bold font-display text-white mb-2 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Pin New Detective Observation</span>
            </h3>
            <p className="text-xs font-mono text-noir-400 mb-4">
              Record a deductive theory or lead to pin directly onto the crime board.
            </p>
            <textarea
              value={customNoteText}
              onChange={(e) => setCustomNoteText(e.target.value)}
              placeholder="e.g. Victor's smart glass indicates he was facing the window when the poison took effect..."
              rows={3}
              className="w-full bg-noir-950 text-xs font-mono text-amber-200 border border-noir-700 rounded-xl p-3 focus:outline-none focus:border-amber-500"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsAddingNote(false)}
                className="px-4 py-2 rounded-lg bg-noir-800 text-xs font-mono text-noir-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomNote}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-mono text-noir-950 font-bold"
              >
                Pin to Board
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
