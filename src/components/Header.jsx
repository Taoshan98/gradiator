import React from 'react';
import { Sun, Moon, Shuffle, RotateCcw } from 'lucide-react';
import Logo from './Logo';

const Github = ({ size = 18, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Header({ theme, toggleTheme, onRandomize, onReset }) {
  return (
    <header className="header-container">
      <div className="header-logo-group">
        <Logo size={52} showText={false} />
        <div>
          <h1 className="logo-title">Gradietor</h1>
          <p className="logo-subtitle">Perceptually uniform multi-stop color interpolator</p>
        </div>
      </div>
      <div className="header-actions">
        <button 
          className="btn btn-secondary tooltip-parent" 
          onClick={onRandomize}
          aria-label="Randomize Stops"
        >
          <Shuffle size={18} />
          <span className="btn-text">Randomize</span>
          <div className="tooltip">Generate random stop colors</div>
        </button>

        <button 
          className="btn btn-secondary tooltip-parent" 
          onClick={onReset}
          aria-label="Reset Gradient"
        >
          <RotateCcw size={18} />
          <span className="btn-text">Reset</span>
          <div className="tooltip">Reset to default scale</div>
        </button>

        <a 
          href="https://github.com/Taoshan98/gradietor" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-secondary btn-icon tooltip-parent github-toggle" 
          aria-label="GitHub Repository"
        >
          <Github size={18} />
          <div className="tooltip">GitHub Repository</div>
        </a>

        <button 
          className="btn btn-secondary btn-icon tooltip-parent theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <div className="tooltip">Switch to {theme === 'dark' ? 'light' : 'dark'} mode</div>
        </button>
      </div>

      <style>{`
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          background: var(--bg-panel);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: background-color 0.4s, border-color 0.4s;
        }

        .header-logo-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-title {
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, var(--text-primary) 40%, var(--accent-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          text-align: left;
        }

        .logo-subtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 0.05rem;
          text-align: left;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .theme-toggle, .github-toggle {
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
            padding: 1rem;
          }

          .header-logo-group {
            justify-content: center;
          }

          .logo-title {
            text-align: center;
          }

          .logo-subtitle {
            text-align: center;
          }

          .header-actions {
            justify-content: center;
            width: 100%;
          }

          .btn-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
