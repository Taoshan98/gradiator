import React, { useState } from 'react';
import { Copy, Check, Code, List, FileText } from 'lucide-react';
import { rgbToHsl, rgbToSpace } from '../utils/colorUtils';

export default function PaletteOutput({ generatedSteps }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'css' | 'export'
  
  // Export Settings State
  const [exportFormat, setExportFormat] = useState('hex'); // 'hex' | 'rgb' | 'hsl' | 'oklch' | 'array'
  const [exportSeparator, setExportSeparator] = useState('newline'); // 'newline' | 'comma' | 'space'
  const [copiedFull, setCopiedFull] = useState(false);

  // Copy single color
  const handleCopyColor = (colorHex, index) => {
    navigator.clipboard.writeText(colorHex);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };

  // Generate CSS Gradient Code
  const getCssGradientCode = () => {
    if (generatedSteps.length === 0) return '';
    const hexColors = generatedSteps.map(s => s.hex).join(', ');
    return `background: linear-gradient(to right, ${hexColors});`;
  };

  // Copy CSS Gradient Code
  const handleCopyCss = () => {
    const code = getCssGradientCode();
    navigator.clipboard.writeText(code);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  // Convert RGB to HSL string
  const formatHsl = (rgb) => {
    const [h, s, l] = rgbToHsl(rgb);
    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  // Convert RGB to Oklch string
  const formatOklch = (rgb) => {
    const [l, c, h] = rgbToSpace(rgb, 'oklch');
    return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${Math.round(h)})`;
  };

  // Get color text in active export format
  const getColorText = (step, format) => {
    switch (format) {
      case 'hex':
        return step.hex;
      case 'rgb':
        return `rgb(${step.rgb[0]}, ${step.rgb[1]}, ${step.rgb[2]})`;
      case 'hsl':
        return formatHsl(step.rgb);
      case 'oklch':
        return formatOklch(step.rgb);
      default:
        return step.hex;
    }
  };

  // Generate formatted color list
  const getFormattedList = () => {
    if (exportFormat === 'array') {
      const items = generatedSteps.map(s => `'${s.hex}'`).join(', ');
      return `[\n  ${items}\n]`;
    }

    const separatorChar = {
      newline: '\n',
      comma: ', ',
      space: ' '
    }[exportSeparator];

    return generatedSteps.map(s => getColorText(s, exportFormat)).join(separatorChar);
  };

  // Copy formatted list
  const handleCopyList = () => {
    const listText = getFormattedList();
    navigator.clipboard.writeText(listText);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  return (
    <div className="output-card card animate-slide-up">
      <div className="output-header-tabs">
        <button 
          className={`tab-btn ${activeTab === 'grid' ? 'active' : ''}`}
          onClick={() => setActiveTab('grid')}
        >
          <List size={16} />
          <span>Colors Grid</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'css' ? 'active' : ''}`}
          onClick={() => setActiveTab('css')}
        >
          <Code size={16} />
          <span>CSS Gradient</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          <FileText size={16} />
          <span>Export Text</span>
        </button>
      </div>

      <div className="tab-content">
        {/* TAB 1: COLORS GRID */}
        {activeTab === 'grid' && (
          <div className="grid-tab-content">
            <div className="color-grid">
              {generatedSteps.map((step, idx) => {
                const isCopied = copiedIndex === idx;
                
                // Determine contrast color for chip text labels
                const r = step.rgb[0];
                const g = step.rgb[1];
                const b = step.rgb[2];
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                const lightText = brightness < 140;

                return (
                  <div 
                    key={idx}
                    className="color-chip-wrapper"
                    onClick={() => handleCopyColor(step.hex, idx)}
                  >
                    <div 
                      className="color-chip"
                      style={{ backgroundColor: step.hex }}
                    >
                      <div className={`color-chip-overlay ${lightText ? 'text-light' : 'text-dark'}`}>
                        {isCopied ? (
                          <div className="chip-copied-indicator">
                            <Check size={18} />
                            <span>Copied!</span>
                          </div>
                        ) : (
                          <>
                            <span className="chip-index">#{idx + 1}</span>
                            <span className="chip-hex font-mono">{step.hex}</span>
                            <span className="chip-rgb font-mono">
                              {step.rgb[0]},{step.rgb[1]},{step.rgb[2]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CSS GRADIENT CODE */}
        {activeTab === 'css' && (
          <div className="css-tab-content animate-slide-up">
            <div className="gradient-preview-strip" style={{ background: getCssGradientCode() }}></div>
            <div className="console-wrapper">
              <pre className="console-code font-mono">
                {getCssGradientCode()}
              </pre>
              <button 
                className="btn btn-primary console-copy-btn"
                onClick={handleCopyCss}
              >
                {copiedFull ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedFull ? 'Copied!' : 'Copy CSS'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: EXPORT TEXT LIST */}
        {activeTab === 'export' && (
          <div className="export-tab-content animate-slide-up">
            <div className="export-settings-row">
              <div className="export-setting">
                <label htmlFor="export-format-select">Format</label>
                <select 
                  id="export-format-select"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value="hex">HEX Code (#FFFFFF)</option>
                  <option value="rgb">RGB (rgb(255, 255, 255))</option>
                  <option value="hsl">HSL (hsl(360, 100%, 100%))</option>
                  <option value="oklch">Oklch (oklch(1.00 0.00 0))</option>
                  <option value="array">JS Array (['#FFFFFF', ...])</option>
                </select>
              </div>

              {exportFormat !== 'array' && (
                <div className="export-setting">
                  <label htmlFor="export-separator-select">Separator</label>
                  <select 
                    id="export-separator-select"
                    value={exportSeparator}
                    onChange={(e) => setExportSeparator(e.target.value)}
                  >
                    <option value="newline">New Line</option>
                    <option value="comma">Comma (,)</option>
                    <option value="space">Space</option>
                  </select>
                </div>
              )}

              <button 
                className="btn btn-primary export-copy-btn"
                onClick={handleCopyList}
              >
                {copiedFull ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedFull ? 'Copied!' : 'Copy Palette'}</span>
              </button>
            </div>

            <textarea 
              readOnly 
              value={getFormattedList()}
              className="export-textarea font-mono"
              rows={Math.min(12, Math.max(5, generatedSteps.length))}
              onClick={(e) => e.target.select()}
              aria-label="Exported color list"
            />
          </div>
        )}
      </div>

      <style>{`
        .output-card {
          margin-bottom: 2rem;
        }

        .output-header-tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--bg-input);
        }

        .tab-btn.active {
          color: var(--accent-primary);
          background: var(--accent-primary-glow);
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 0.75rem;
        }

        @media (max-width: 1024px) {
          .color-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        @media (max-width: 640px) {
          .color-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .color-chip-wrapper {
          cursor: pointer;
        }

        .color-chip {
          height: 6rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s;
        }

        .color-chip-wrapper:hover .color-chip {
          transform: translateY(-4px) scale(1.03);
          box-shadow: var(--shadow-md), 0 4px 10px rgba(0,0,0,0.1);
        }

        .color-chip-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .color-chip-wrapper:hover .color-chip-overlay {
          opacity: 1;
        }

        .text-light {
          color: #ffffff;
        }

        .text-dark {
          color: #0f172a;
        }

        .chip-index {
          font-size: 0.7rem;
          font-weight: 800;
          opacity: 0.6;
        }

        .chip-hex {
          font-size: 0.85rem;
          font-weight: 700;
          margin-top: 0.2rem;
          text-transform: uppercase;
        }

        .chip-rgb {
          font-size: 0.6rem;
          opacity: 0.7;
          margin-top: 0.15rem;
        }

        .chip-copied-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          animation: scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .chip-copied-indicator span {
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* CSS TAB STYLING */
        .gradient-preview-strip {
          height: 3rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1rem;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .console-wrapper {
          position: relative;
          background: #0f172a;
          color: #38bdf8;
          padding: 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid #1e293b;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .console-code {
          font-size: 0.85rem;
          word-break: break-all;
          white-space: pre-wrap;
          flex-grow: 1;
        }

        .console-copy-btn {
          flex-shrink: 0;
        }

        /* EXPORT TAB STYLING */
        .export-tab-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .export-settings-row {
          display: flex;
          align-items: flex-end;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .export-setting {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .export-setting label {
          font-size: 0.75rem;
          font-weight: 700;
        }

        .export-setting select {
          padding: 0.5rem 2rem 0.5rem 0.75rem;
          font-size: 0.85rem;
        }

        .export-copy-btn {
          margin-left: auto;
          padding: 0.55rem 1rem;
          font-size: 0.85rem;
        }

        .export-textarea {
          width: 100%;
          padding: 0.75rem;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          resize: vertical;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .export-textarea:focus {
          border-color: var(--accent-primary);
          outline: none;
        }

        @media (max-width: 576px) {
          .export-copy-btn {
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
