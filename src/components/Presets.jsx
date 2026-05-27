import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { generateRandomHex } from '../utils/colorUtils';

const ADJECTIVES = [
  'Amazing', 'Jolly', 'Quirky', 'Funky', 'Wacky',
  'Groovy', 'Cosmic', 'Mighty', 'Sneaky', 'Fuzzy',
  'Bouncy', 'Shiny', 'Crazy', 'Sleepy', 'Giggly',
  'Sparkly', 'Dandy', 'Cheeky', 'Magic', 'Fluffy'
];

const TOOLS = [
  'Hammer', 'Screwdriver', 'Drill', 'Saw', 'Wrench',
  'Pliers', 'Trowel', 'Shovel', 'Level', 'Ladder',
  'Helmet', 'Toolbox', 'Tape', 'Wheelbarrow', 'Concrete Mixer',
  'Crane', 'Bulldozer', 'Jackhammer', 'Excavator', 'Scaffolding'
];

function generate7Presets() {
  const shuffle = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const shuffledAdjectives = shuffle(ADJECTIVES);
  const shuffledTools = shuffle(TOOLS);

  const list = [];
  for (let i = 0; i < 7; i++) {
    const name = `${shuffledAdjectives[i]} ${shuffledTools[i]}`;
    const numStops = Math.random() > 0.5 ? 3 : 2;
    const stops = [];

    if (numStops === 2) {
      stops.push({ id: 'stop-1', color: generateRandomHex(), position: 0 });
      stops.push({ id: 'stop-2', color: generateRandomHex(), position: 100 });
    } else {
      stops.push({ id: 'stop-1', color: generateRandomHex(), position: 0 });
      stops.push({ id: 'stop-2', color: generateRandomHex(), position: 50 });
      stops.push({ id: 'stop-3', color: generateRandomHex(), position: 100 });
    }

    list.push({ name, stops });
  }
  return list;
}

export default function Presets({ onLoadPreset }) {
  const [presets] = useState(() => generate7Presets());
  
  // Helper to generate CSS gradient string for small thumbnail visual preview
  const getPresetGradientCss = (stops) => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    return `linear-gradient(to right, ${sorted.map(s => `${s.color} ${s.position}%`).join(', ')})`;
  };

  return (
    <div className="presets-card card animate-slide-up">
      <div className="presets-header">
        <Flame size={18} className="presets-icon" />
        <h3 className="presets-title">Designer Presets</h3>
      </div>
      
      <div className="presets-grid">
        {presets.map((preset, idx) => {
          return (
            <button 
              key={idx}
              className="preset-item"
              onClick={() => onLoadPreset(preset.stops)}
              aria-label={`Load preset ${preset.name}`}
            >
              <div 
                className="preset-preview"
                style={{ background: getPresetGradientCss(preset.stops) }}
              />
              <div className="preset-info">
                <span className="preset-name">{preset.name}</span>
                <span className="preset-stops-count">{preset.stops.length} stops</span>
              </div>
            </button>
          );
        })}
      </div>

      <style>{`
        .presets-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .presets-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
        }

        .presets-icon {
          color: #f59e0b;
        }

        .presets-title {
          font-weight: 700;
          color: var(--text-primary);
        }

        .presets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
          gap: 0.75rem;
        }

        .preset-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.6rem;
          background: var(--bg-input);
          border: 1px solid transparent;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .preset-item:hover {
          background: var(--bg-panel-solid);
          border-color: var(--border-hover);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .preset-preview {
          height: 1.75rem;
          border-radius: 4px;
          box-shadow: inset 0 0 0 1px var(--border-color);
          background-clip: padding-box;
          width: 100%;
        }

        .preset-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .preset-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .preset-stops-count {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        @media (max-width: 576px) {
          .presets-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
