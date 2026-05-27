import React from 'react';
import { Plus, Trash2, SlidersHorizontal, Grid } from 'lucide-react';
import { generateRandomHex } from '../utils/colorUtils';

export default function StopManager({
  stops,
  activeStopId,
  onSelectStop,
  onUpdateStopColor,
  onUpdateStopPosition,
  onAddStop,
  onDeleteStop,
  onDistributeStops
}) {
  
  // Add a new stop at a smart position (e.g. 50% or halfway between existing ones)
  const handleAddStop = () => {
    // Generate a random position or default intermediate
    let position = 50;
    // Try to find a gap
    const sortedPositions = stops.map(s => s.position).sort((a,b) => a - b);
    
    // Find largest gap
    let maxGap = 0;
    let gapStart = 0;
    for (let i = 0; i < sortedPositions.length - 1; i++) {
      const gap = sortedPositions[i+1] - sortedPositions[i];
      if (gap > maxGap) {
        maxGap = gap;
        gapStart = sortedPositions[i];
      }
    }
    
    if (maxGap > 10) {
      position = Math.round(gapStart + maxGap / 2);
    } else {
      // If no big gap, pick a random position between 10 and 90
      position = Math.floor(Math.random() * 80) + 10;
    }
    
    onAddStop(position, generateRandomHex());
  };

  // Safe color text input change handler
  const handleHexInputChange = (id, val) => {
    // Validate hex string
    if (/^#[0-9A-F]{6}$/i.test(val) || /^#[0-9A-F]{3}$/i.test(val)) {
      onUpdateStopColor(id, val);
    } else if (/^[0-9A-F]{6}$/i.test(val)) {
      onUpdateStopColor(id, `#${val}`);
    }
  };

  return (
    <div className="stop-manager-card card animate-slide-up">
      <div className="manager-header">
        <h3 className="manager-title">Color Stops Manager</h3>
        <div className="manager-header-actions">
          <button 
            className="btn btn-secondary btn-small tooltip-parent"
            onClick={onDistributeStops}
            title="Distribute Stops Evenly"
          >
            <Grid size={15} />
            <span className="btn-small-text">Distribute</span>
            <div className="tooltip">Distribute stop positions evenly</div>
          </button>
          
          <button 
            className="btn btn-primary btn-small"
            onClick={handleAddStop}
          >
            <Plus size={15} />
            <span className="btn-small-text">Add Stop</span>
          </button>
        </div>
      </div>

      <div className="stops-list">
        {stops
          .sort((a, b) => a.position - b.position)
          .map((stop, index) => {
            const isActive = stop.id === activeStopId;
            const canDelete = stops.length > 2;

            return (
              <div 
                key={stop.id} 
                className={`stop-row ${isActive ? 'active' : ''}`}
                onClick={() => onSelectStop(stop.id)}
              >
                <div className="stop-badge">
                  <span>Stop {index + 1}</span>
                </div>

                <div className="color-picker-container">
                  <div 
                    className="color-swatch-preview"
                    style={{ backgroundColor: stop.color }}
                  >
                    <input 
                      type="color" 
                      value={stop.color} 
                      onChange={(e) => onUpdateStopColor(stop.id, e.target.value)}
                      className="color-picker-input"
                    />
                  </div>
                  <input 
                    type="text" 
                    defaultValue={stop.color}
                    key={stop.color} // reset value on external change
                    onBlur={(e) => handleHexInputChange(stop.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleHexInputChange(stop.id, e.target.value);
                    }}
                    className="hex-text-input font-mono"
                    placeholder="#ffffff"
                    aria-label="Hex color value"
                  />
                </div>

                <div className="position-slider-container">
                  <SlidersHorizontal size={14} className="slider-icon" />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={Math.round(stop.position)}
                    onChange={(e) => onUpdateStopPosition(stop.id, parseInt(e.target.value))}
                    className="stop-position-slider"
                    aria-label="Stop position percentage"
                  />
                  <span className="position-percentage font-mono">
                    {Math.round(stop.position)}%
                  </span>
                </div>

                <button 
                  className={`btn-delete ${!canDelete ? 'disabled' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canDelete) onDeleteStop(stop.id);
                  }}
                  disabled={!canDelete}
                  aria-label="Delete stop"
                  title={canDelete ? "Delete color stop" : "Need at least 2 stops"}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
      </div>

      <style>{`
        .stop-manager-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          height: 100%;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
        }

        .manager-title {
          font-weight: 700;
          color: var(--text-primary);
        }

        .manager-header-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-small {
          padding: 0.4rem 0.75rem;
          font-size: 0.8rem;
          border-radius: var(--radius-sm);
        }

        .stops-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: calc(3 * 3.75rem + 2 * 0.75rem + 6px);
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .stop-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: var(--bg-input);
          border: 1px solid transparent;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
        }

        .stop-row:hover {
          border-color: var(--border-hover);
        }

        .stop-row.active {
          background: var(--bg-panel-solid);
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-sm), 0 0 10px var(--accent-primary-glow);
        }

        .stop-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: var(--bg-app);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          min-width: 3.5rem;
          text-align: center;
        }

        .color-picker-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .color-swatch-preview {
          position: relative;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          cursor: pointer;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          flex-shrink: 0;
        }

        .color-picker-input {
          position: absolute;
          top: -5px;
          left: -5px;
          width: calc(100% + 10px);
          height: calc(100% + 10px);
          opacity: 0;
          cursor: pointer;
        }

        .hex-text-input {
          width: 5.5rem;
          padding: 0.4rem 0.5rem;
          border: 1px solid var(--border-color);
          background: var(--bg-app);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          text-align: center;
          text-transform: uppercase;
        }

        .hex-text-input:focus {
          border-color: var(--accent-primary);
          outline: none;
        }

        .position-slider-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-grow: 1;
        }

        .slider-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .stop-position-slider {
          flex-grow: 1;
        }

        .position-percentage {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          min-width: 2.5rem;
          text-align: right;
          flex-shrink: 0;
        }

        .btn-delete {
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-delete:hover:not(.disabled) {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .btn-delete.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .stop-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          
          .position-slider-container {
            width: 100%;
          }

          .color-picker-container {
            justify-content: space-between;
          }
          
          .btn-delete {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
