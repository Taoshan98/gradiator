import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import GradientPreview from './components/GradientPreview';
import StopManager from './components/StopManager';
import Controls from './components/Controls';
import PaletteOutput from './components/PaletteOutput';
import Presets from './components/Presets';
import { generateGradientSteps, generateRandomHex } from './utils/colorUtils';
import { version } from '../package.json';

const DEFAULT_STOPS = [
  { id: 'stop-1', color: '#8b5cf6', position: 0 },
  { id: 'stop-2', color: '#06b6d4', position: 100 }
];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('gradietor-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Gradient state
  const [stops, setStops] = useState(DEFAULT_STOPS);
  const [space, setSpace] = useState('oklch');
  const [huePath, setHuePath] = useState('shorter');
  const [steps, setSteps] = useState(9);
  const [activeStopId, setActiveStopId] = useState('stop-1');

  // Sync theme attribute with HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gradietor-theme', theme);
  }, [theme]);

  // Toggle theme handler
  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Memoize generated steps calculation
  const generatedSteps = useMemo(() => {
    return generateGradientSteps(stops, steps, space, huePath);
  }, [stops, steps, space, huePath]);

  // Stop CRUD Operations
  const handleUpdateStopPosition = (id, position) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, position } : s));
  };

  const handleUpdateStopColor = (id, color) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, color } : s));
  };

  const handleAddStop = (position, color) => {
    const newId = `stop-${Date.now()}`;
    const newStop = { id: newId, color, position };
    setStops(prev => [...prev, newStop]);
    setActiveStopId(newId);
  };

  const handleDeleteStop = (id) => {
    if (stops.length <= 2) return;
    const remaining = stops.filter(s => s.id !== id);
    setStops(remaining);
    // If deleted stop was active, select another one
    if (activeStopId === id) {
      setActiveStopId(remaining[0].id);
    }
  };

  // Sort and distribute stops evenly
  const handleDistributeStops = () => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const count = sorted.length;
    const distributed = sorted.map((stop, idx) => ({
      ...stop,
      position: count > 1 ? Math.round((idx / (count - 1)) * 100) : 0
    }));
    setStops(distributed);
  };

  // Randomize colors for all existing stops
  const handleRandomize = () => {
    setStops(prev => prev.map(s => ({
      ...s,
      color: generateRandomHex()
    })));
  };

  // Reset to default
  const handleReset = () => {
    setStops(DEFAULT_STOPS);
    setSpace('oklch');
    setHuePath('shorter');
    setSteps(9);
    setActiveStopId('stop-1');
  };

  // Load a preset
  const handleLoadPreset = (presetStops) => {
    setStops(presetStops);
    setActiveStopId(presetStops[0].id);
  };

  return (
    <div className="app-layout">
      <Header
        theme={theme}
        toggleTheme={handleToggleTheme}
        onRandomize={handleRandomize}
        onReset={handleReset}
      />

      <main className="main-content">
        <GradientPreview
          stops={stops}
          onUpdateStopPosition={handleUpdateStopPosition}
          onAddStop={handleAddStop}
          activeStopId={activeStopId}
          onSelectStop={setActiveStopId}
          generatedSteps={generatedSteps}
        />

        <Presets onLoadPreset={handleLoadPreset} />

        <div className="dashboard-grid">
          <div className="sidebar-column">
            <Controls
              space={space}
              onSpaceChange={setSpace}
              huePath={huePath}
              onHuePathChange={setHuePath}
              steps={steps}
              onStepsChange={setSteps}
            />
          </div>

          <div className="manager-column">
            <StopManager
              stops={stops}
              activeStopId={activeStopId}
              onSelectStop={setActiveStopId}
              onUpdateStopColor={handleUpdateStopColor}
              onUpdateStopPosition={handleUpdateStopPosition}
              onAddStop={handleAddStop}
              onDeleteStop={handleDeleteStop}
              onDistributeStops={handleDistributeStops}
            />
          </div>
        </div>

        <PaletteOutput generatedSteps={generatedSteps} />
      </main>

      <footer className="app-footer">
        <p>Made with ❤️ for Developers — v{version}</p>
      </footer>

      <style>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-app);
          transition: background-color 0.4s;
        }

        .main-content {
          flex: 1;
          max-width: 1300px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 20rem 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
          align-items: stretch;
        }

        .sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          height: 100%;
          position: relative;
          z-index: 5;
        }

        .sidebar-column > * {
          flex-grow: 1;
        }

        .manager-column {
          height: 100%;
          position: relative;
          z-index: 1;
        }

        .manager-column > * {
          height: 100%;
        }

        .app-footer {
          padding: 2rem;
          text-align: center;
          border-top: 1px solid var(--border-color);
          background: var(--bg-panel);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
        }

        .app-footer p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .main-content {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
