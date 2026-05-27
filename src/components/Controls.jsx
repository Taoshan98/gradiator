import React from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { isCylindrical } from '../utils/colorUtils';

// Information about each color space for helpful premium tooltips
const COLOR_SPACE_INFO = {
  srgb: 'Standard RGB: standard monitor colors. Tends to produce gray, muddy tones in the middle of gradients.',
  hsl: 'Hue, Saturation, Lightness: cylindrical RGB. Can sweep through rainbow-like intermediate hues.',
  hsv: 'Hue, Saturation, Value: cylindrical RGB representation, useful for artist-friendly color picking.',
  hwb: 'Hue, Whiteness, Blackness: simple cylindrical space, great for natural shading.',
  xyz: 'CIE 1931 XYZ: the standard reference space representing all human-perceptible colors.',
  lab: 'CIELAB: perceptually uniform color space. Calculates gradients based on human color vision.',
  lch: 'CIELCH: cylindrical representation of CIELAB. High saturation gradients.',
  oklab: 'Oklab: (Highly Recommended) Modern, extremely uniform color space. Creates exceptionally smooth transitions.',
  oklch: 'Oklch: (Recommended) Cylindrical Oklab. Keeps saturation and lightness consistent while smoothly sweeping hues.'
};

export default function Controls({
  space,
  onSpaceChange,
  huePath,
  onHuePathChange,
  steps,
  onStepsChange
}) {
  const showHuePath = isCylindrical(space);

  const handleStepsSliderChange = (e) => {
    onStepsChange(parseInt(e.target.value));
  };

  const handleStepsInputChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 2;
    val = Math.max(2, Math.min(50, val)); // allow up to 50
    onStepsChange(val);
  };

  return (
    <div className="controls-card card animate-slide-up">
      <h3 className="controls-title">Interpolation Settings</h3>
      
      <div className="control-group">
        <label htmlFor="color-space-select">
          <div className="label-with-info">
            <span>Color Interpolation Space</span>
            <div className="tooltip-parent">
              <HelpCircle size={14} className="info-icon" />
              <div className="tooltip wide-tooltip">{COLOR_SPACE_INFO[space]}</div>
            </div>
          </div>
          <select 
            id="color-space-select"
            value={space} 
            onChange={(e) => onSpaceChange(e.target.value)}
          >
            <option value="oklch">Oklch (Perceptually Uniform Cylindrical - Recommended)</option>
            <option value="oklab">Oklab (Perceptually Uniform - Recommended)</option>
            <option value="lch">CIELCH (Cylindrical LAB)</option>
            <option value="lab">CIELAB (Standard Perceptual)</option>
            <option value="hsl">HSL (Hue, Saturation, Lightness)</option>
            <option value="hsv">HSV (Hue, Saturation, Value)</option>
            <option value="hwb">HWB (Hue, Whiteness, Blackness)</option>
            <option value="srgb">sRGB (Standard Digital)</option>
            <option value="xyz">CIE XYZ (Reference Space)</option>
          </select>
        </label>
      </div>

      {showHuePath && (
        <div className="control-group animate-slide-in">
          <label htmlFor="hue-path-select">
            <div className="label-with-info">
              <span>Hue Interpolation Path</span>
              <div className="tooltip-parent">
                <HelpCircle size={14} className="info-icon" />
                <div className="tooltip">
                  Determines which direction around the color wheel to interpolate hue angles.
                </div>
              </div>
            </div>
            <select 
              id="hue-path-select"
              value={huePath} 
              onChange={(e) => onHuePathChange(e.target.value)}
            >
              <option value="shorter">Shorter Path (Takes shortest angle - default)</option>
              <option value="longer">Longer Path (Takes longest angle - wraps around)</option>
            </select>
          </label>
        </div>
      )}

      <div className="control-group">
        <label htmlFor="steps-range">
          <div className="label-with-info">
            <span>Steps Count</span>
            <span className="steps-value-indicator font-mono">{steps} colors</span>
          </div>
          <div className="steps-slider-input-group">
            <input 
              id="steps-range"
              type="range" 
              min="2" 
              max="50" 
              value={steps > 50 ? 50 : steps} 
              onChange={handleStepsSliderChange}
              className="steps-slider"
            />
            <input 
              type="number" 
              min="2" 
              max="50" 
              value={steps} 
              onChange={handleStepsInputChange}
              className="steps-number-input font-mono"
              aria-label="Steps count number"
            />
          </div>
        </label>
      </div>

      <style>{`
        .controls-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .controls-title {
          font-weight: 700;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
        }

        .control-group {
          display: flex;
          flex-direction: column;
        }

        .label-with-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .info-icon {
          color: var(--text-secondary);
          cursor: help;
          vertical-align: middle;
          margin-left: 0.25rem;
        }

        .wide-tooltip {
          width: 250px;
          white-space: normal;
          text-align: left;
          line-height: 1.4;
          padding: 0.5rem 0.75rem;
        }

        .steps-value-indicator {
          font-size: 0.85rem;
          color: var(--accent-primary);
          font-weight: 700;
        }

        .steps-slider-input-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .steps-slider {
          flex-grow: 1;
        }

        .steps-number-input {
          width: 4rem;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          background: var(--bg-input);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 700;
          text-align: center;
        }

        .steps-number-input:focus {
          border-color: var(--accent-primary);
          outline: none;
        }

        /* Slide in animation for hue path dropdown */
        @keyframes slideIn {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-8px);
            margin-bottom: 0;
          }
          to {
            opacity: 1;
            max-height: 80px;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          overflow: hidden;
        }

        .animate-slide-in:has(.tooltip-parent:hover) {
          overflow: visible;
        }
      `}</style>
    </div>
  );
}
