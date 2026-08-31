import React, { useState } from 'react';
import {
  FileText, Download, Printer, Shield, Clock, MapPin,
  Users, Fingerprint, Zap, AlertTriangle, CheckCircle2, Scale
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { soundService } from '../services/soundService';

function generateChargesheetPDF(activeCase) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addPage = () => {
    doc.addPage();
    y = margin;
  };

  const checkPageBreak = (needed = 30) => {
    if (y + needed > pageHeight - margin) addPage();
  };

  const drawLine = (yPos) => {
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  };

  const addWrappedText = (text, x, startY, maxWidth, lineHeight = 5) => {
    const lines = doc.splitTextToSize(text || '', maxWidth);
    lines.forEach((line, i) => {
      checkPageBreak(lineHeight);
      doc.text(line, x, startY + i * lineHeight);
    });
    return startY + lines.length * lineHeight;
  };

  // ═══════════════════════════════════════════════════
  // COVER PAGE
  // ═══════════════════════════════════════════════════

  // Top border
  doc.setFillColor(139, 0, 0);
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Header block
  doc.setFillColor(20, 20, 25);
  doc.rect(margin, 20, contentWidth, 45, 'F');
  doc.setDrawColor(139, 0, 0);
  doc.setLineWidth(1);
  doc.rect(margin, 20, contentWidth, 45, 'S');

  doc.setTextColor(200, 50, 50);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIDENTIAL — LAW ENFORCEMENT USE ONLY', pageWidth / 2, 30, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('CHARGESHEET & CASE DOSSIER', pageWidth / 2, 42, { align: 'center' });

  doc.setTextColor(200, 180, 100);
  doc.setFontSize(10);
  doc.text('Detective-L Forensic Investigation Suite', pageWidth / 2, 52, { align: 'center' });

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, pageWidth / 2, 60, { align: 'center' });

  // Case title
  y = 80;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(activeCase.title || 'Untitled Case', contentWidth);
  titleLines.forEach((line, i) => {
    doc.text(line, pageWidth / 2, y + i * 8, { align: 'center' });
  });
  y += titleLines.length * 8 + 5;

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(10);
  doc.text(activeCase.subtitle || '', pageWidth / 2, y, { align: 'center' });
  y += 10;

  drawLine(y);
  y += 8;

  // Case metadata
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const metaItems = [
    ['Case ID:', activeCase.id || 'N/A'],
    ['Status:', activeCase.status || 'ACTIVE INVESTIGATION'],
    ['Classification:', activeCase.difficulty || 'N/A'],
    ['Victim:', `${activeCase.victim || 'Unknown'} (${activeCase.victimRole || 'Unknown'})`],
    ['Time of Death:', activeCase.timeOfDeath || 'Unknown'],
    ['Location:', activeCase.location || 'Unknown'],
    ['Murder Weapon:', activeCase.murderWeapon || 'Under Investigation'],
  ];

  metaItems.forEach(([label, value]) => {
    checkPageBreak(8);
    doc.setTextColor(200, 180, 100);
    doc.text(label, margin, y);
    doc.setTextColor(220, 220, 220);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 40, y);
    doc.setFont('helvetica', 'bold');
    y += 7;
  });

  // ═══════════════════════════════════════════════════
  // SECTION 1: CASE OVERVIEW
  // ═══════════════════════════════════════════════════
  addPage();
  doc.setTextColor(200, 50, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SECTION 1: CASE OVERVIEW', margin, y);
  y += 8;
  drawLine(y);
  y += 6;

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  y = addWrappedText(activeCase.overview || 'No case overview available.', margin, y, contentWidth);
  y += 6;

  doc.setTextColor(200, 180, 100);
  doc.setFont('helvetica', 'bold');
  doc.text('Crime Details:', margin, y);
  y += 6;
  doc.setTextColor(200, 200, 200);
  doc.setFont('helvetica', 'normal');
  y = addWrappedText(activeCase.crimeDetails || 'Under investigation.', margin, y, contentWidth);

  // ═══════════════════════════════════════════════════
  // SECTION 2: EVIDENCE SUMMARY
  // ═══════════════════════════════════════════════════
  y += 10;
  checkPageBreak(20);
  doc.setTextColor(200, 50, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SECTION 2: EVIDENCE SUMMARY', margin, y);
  y += 8;
  drawLine(y);
  y += 6;

  const discoveredClues = (activeCase.clues || []).filter(c => c.discovered);

  if (discoveredClues.length > 0) {
    // Table header
    doc.setFillColor(40, 40, 50);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setTextColor(200, 180, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('#', margin + 2, y + 5);
    doc.text('Evidence Title', margin + 10, y + 5);
    doc.text('Category', margin + 85, y + 5);
    doc.text('Significance', margin + 115, y + 5);
    y += 9;

    discoveredClues.forEach((clue, idx) => {
      checkPageBreak(12);
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');

      doc.text(`${idx + 1}`, margin + 2, y);
      const titleLines = doc.splitTextToSize(clue.title || '', 70);
      doc.text(titleLines[0], margin + 10, y);
      doc.text(clue.category?.toUpperCase() || '', margin + 85, y);
      const sigLines = doc.splitTextToSize(clue.significance || '', 60);
      doc.text(sigLines[0], margin + 115, y);
      y += 6;

      // Description
      doc.setTextColor(140, 140, 140);
      doc.setFontSize(7);
      const descLines = doc.splitTextToSize(clue.description || '', contentWidth - 10);
      descLines.slice(0, 2).forEach(line => {
        checkPageBreak(5);
        doc.text(line, margin + 10, y);
        y += 4;
      });
      y += 2;
    });
  } else {
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text('No evidence discovered yet.', margin, y);
    y += 8;
  }

  // ═══════════════════════════════════════════════════
  // SECTION 3: SUSPECT PROFILES
  // ═══════════════════════════════════════════════════
  addPage();
  doc.setTextColor(200, 50, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SECTION 3: SUSPECT PROFILES', margin, y);
  y += 8;
  drawLine(y);
  y += 6;

  (activeCase.suspects || []).forEach((suspect, idx) => {
    checkPageBreak(45);

    // Suspect header bar
    doc.setFillColor(suspect.isKiller ? 80 : 35, suspect.isKiller ? 20 : 35, suspect.isKiller ? 20 : 45);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`SUSPECT ${idx + 1}: ${suspect.name}${suspect.isKiller ? ' ★ PRIME SUSPECT' : ''}`, margin + 3, y + 6);
    y += 11;

    doc.setFontSize(9);
    const suspectFields = [
      ['Role:', suspect.role],
      ['Age:', String(suspect.age || 'Unknown')],
      ['Personality:', suspect.personality],
      ['Public Alibi:', `"${suspect.publicAlibi}"`],
    ];

    suspectFields.forEach(([label, value]) => {
      checkPageBreak(8);
      doc.setTextColor(200, 180, 100);
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin + 3, y);
      doc.setTextColor(200, 200, 200);
      doc.setFont('helvetica', 'normal');
      y = addWrappedText(value || '', margin + 35, y, contentWidth - 38, 5);
      y += 1;
    });

    y += 5;
  });

  // ═══════════════════════════════════════════════════
  // SECTION 4: CONNECTIONS & DEDUCTIONS
  // ═══════════════════════════════════════════════════
  checkPageBreak(40);
  y += 5;
  doc.setTextColor(200, 50, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SECTION 4: PINBOARD CONNECTIONS', margin, y);
  y += 8;
  drawLine(y);
  y += 6;

  const connections = activeCase.defaultConnections || [];
  if (connections.length > 0) {
    connections.forEach((conn, idx) => {
      checkPageBreak(8);
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${idx + 1}. ${conn.from || '?'} → ${conn.to || '?'}: ${conn.label || 'Connection'}`, margin + 3, y);
      y += 6;
    });
  } else {
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text('No connections established yet.', margin, y);
    y += 8;
  }

  // ═══════════════════════════════════════════════════
  // SECTION 5: FINAL ACCUSATION & LEGAL ASSESSMENT
  // ═══════════════════════════════════════════════════
  addPage();
  doc.setTextColor(200, 50, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SECTION 5: FINAL ACCUSATION & LEGAL ASSESSMENT', margin, y);
  y += 8;
  drawLine(y);
  y += 8;

  const killer = (activeCase.suspects || []).find(s => s.isKiller);

  if (killer) {
    doc.setFillColor(80, 20, 20);
    doc.rect(margin, y, contentWidth, 10, 'F');
    doc.setDrawColor(200, 50, 50);
    doc.setLineWidth(0.8);
    doc.rect(margin, y, contentWidth, 10, 'S');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`ACCUSED: ${killer.name}`, pageWidth / 2, y + 7, { align: 'center' });
    y += 15;

    const verdictFields = [
      ['Murder Weapon:', activeCase.murderWeapon],
      ['Actual Motive:', activeCase.actualMotive],
      ['Key Contradiction:', activeCase.keyContradiction],
      ['Vulnerabilities:', killer.vulnerabilities],
      ['Hidden Secret:', killer.hiddenSecret],
    ];

    verdictFields.forEach(([label, value]) => {
      checkPageBreak(12);
      doc.setTextColor(200, 180, 100);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, y);
      y += 6;
      doc.setTextColor(200, 200, 200);
      doc.setFont('helvetica', 'normal');
      y = addWrappedText(value || 'Under investigation', margin + 3, y, contentWidth - 6);
      y += 4;
    });
  } else {
    doc.setTextColor(200, 180, 100);
    doc.setFontSize(12);
    doc.text('No accused identified yet. Investigation ongoing.', margin, y);
    y += 10;
  }

  // Footer on every page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(139, 0, 0);
    doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.text(`Detective-L Chargesheet — ${activeCase.title} — Page ${i}/${totalPages}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
    doc.text('CONFIDENTIAL', margin, pageHeight - 6);
  }

  // Save
  const filename = `Chargesheet_${(activeCase.title || 'Case').replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  return filename;
}

export default function ChargesheetExport({ activeCase }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastFilename, setLastFilename] = useState('');

  const discoveredClues = (activeCase.clues || []).filter(c => c.discovered);
  const connections = activeCase.defaultConnections || [];
  const killer = (activeCase.suspects || []).find(s => s.isKiller);

  const handleGenerate = () => {
    soundService.playTypewriter();
    setIsGenerating(true);
    try {
      const filename = generateChargesheetPDF(activeCase);
      setLastFilename(filename);
      soundService.playClueFound();
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const sections = [
    {
      title: 'Case Overview',
      icon: FileText,
      status: activeCase.overview ? 'complete' : 'incomplete',
      detail: activeCase.title
    },
    {
      title: 'Evidence Summary',
      icon: Fingerprint,
      status: discoveredClues.length > 0 ? 'complete' : 'incomplete',
      detail: `${discoveredClues.length}/${(activeCase.clues || []).length} items discovered`
    },
    {
      title: 'Suspect Profiles',
      icon: Users,
      status: (activeCase.suspects || []).length > 0 ? 'complete' : 'incomplete',
      detail: `${(activeCase.suspects || []).length} suspects profiled`
    },
    {
      title: 'Pinboard Connections',
      icon: Zap,
      status: connections.length > 0 ? 'complete' : 'incomplete',
      detail: `${connections.length} connections established`
    },
    {
      title: 'Final Accusation',
      icon: Scale,
      status: killer ? 'complete' : 'incomplete',
      detail: killer ? `Accused: ${killer.name}` : 'No accusation filed'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 h-full flex-1 min-h-0 flex flex-col gap-3 overflow-hidden font-mono">

      {/* Header */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-noir-800 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blood-600/10 text-blood-500 border border-blood-500/30 flex-shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold font-display text-white">
              Official Chargesheet & Case Dossier
            </h2>
            <p className="text-[11px] text-noir-400">
              Generate a court-admissible PDF report from your investigation findings
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blood-600 hover:bg-blood-700 text-white font-bold text-xs shadow-neon-red transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Printer className="w-4 h-4 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Generate & Download PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto glass-panel rounded-2xl border border-noir-800 p-4 sm:p-6 space-y-6">

        {/* PDF Preview Sections */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Chargesheet Contents Preview
          </h3>

          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className={`p-3 sm:p-4 rounded-xl border flex items-center justify-between gap-3 ${
                  section.status === 'complete'
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-noir-900/50 border-noir-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    section.status === 'complete' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-noir-800 text-noir-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Section {idx + 1}: {section.title}
                    </h4>
                    <p className="text-[10px] text-noir-400">{section.detail}</p>
                  </div>
                </div>
                {section.status === 'complete' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Case Quick Summary */}
        <div className="p-4 rounded-xl bg-noir-950 border border-noir-800 space-y-3">
          <h3 className="text-xs font-bold text-blood-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Shield className="w-4 h-4" />
            <span>Case Summary for Chargesheet</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-noir-500">Case:</span>
              <span className="text-white ml-2 font-bold">{activeCase.title}</span>
            </div>
            <div>
              <span className="text-noir-500">Victim:</span>
              <span className="text-white ml-2">{activeCase.victim}</span>
            </div>
            <div>
              <span className="text-noir-500">Time of Death:</span>
              <span className="text-amber-400 ml-2">{activeCase.timeOfDeath}</span>
            </div>
            <div>
              <span className="text-noir-500">Location:</span>
              <span className="text-white ml-2">{activeCase.location}</span>
            </div>
            <div>
              <span className="text-noir-500">Murder Weapon:</span>
              <span className="text-blood-400 ml-2 font-bold">{activeCase.murderWeapon}</span>
            </div>
            <div>
              <span className="text-noir-500">Accused:</span>
              <span className={`ml-2 font-bold ${killer ? 'text-blood-400' : 'text-noir-500'}`}>
                {killer ? killer.name : 'Not yet identified'}
              </span>
            </div>
          </div>

          {activeCase.keyContradiction && (
            <div className="mt-2 p-3 rounded-lg bg-blood-950/40 border border-blood-800/50">
              <span className="text-[10px] text-blood-400 uppercase font-bold block mb-1">Key Contradiction:</span>
              <p className="text-xs text-blood-200">{activeCase.keyContradiction}</p>
            </div>
          )}
        </div>

        {/* Success message */}
        {lastFilename && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Chargesheet downloaded as <strong>{lastFilename}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
