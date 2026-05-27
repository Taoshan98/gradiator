import React, { useRef, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

export default function GradientPreview({ 
  stops, 
  onUpdateStopPosition, 
  onAddStop, 
  activeStopId, 
  onSelectStop,
  generatedSteps 
}) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedStopId, setDraggedStopId] = useState(null);

  // Generate CSS gradient string from the output steps to show the EXACT interpolation
  const gradientString = generatedSteps.length > 0
    ? `linear-gradient(to right, ${generatedSteps.map(s => s.hex).join(', ')})`
    : 'linear-gradient(to right, #000, #fff)';

  // Handles drag move (calculates new percentage and triggers parent update)
  const handleDragMove = (clientX) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const width = rect.width;
    const left = rect.left;
    
    // Calculate percentage position
    let position = ((clientX - left) / width) * 100;
    position = Math.max(0, Math.min(100, Math.round(position)));
    
    if (draggedStopId !== null) {
      onUpdateStopPosition(draggedStopId, position);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleDragMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length === 0) return;
    handleDragMove(e.touches[0].clientX);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedStopId(null);
  };

  // Listen globally to mouseup/mousemove during drag for smooth out-of-bounds drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, draggedStopId]);

  const handleMouseDown = (id, e) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggedStopId(id);
    onSelectStop(id);
  };

  const handleTouchStart = (id, e) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggedStopId(id);
    onSelectStop(id);
  };

  // Double click track to add a stop
  const handleTrackDoubleClick = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const width = rect.width;
    const left = rect.left;
    let position = ((e.clientX - left) / width) * 100;
    position = Math.max(0, Math.min(100, Math.round(position)));
    
    // Find color at this position in generated steps
    // Estimate from generatedSteps array index
    const index = Math.round((position / 100) * (generatedSteps.length - 1));
    const color = generatedSteps[index]?.hex || '#8b5cf6';
    
    onAddStop(position, color);
  };

  return (
    <div className="preview-card card animate-slide-up">
      <div className="preview-header">
        <h3 className="preview-title">Live Gradient Visualizer</h3>
        <span className="preview-tip">Double-click track to add a stop. Drag pins to move.</span>
      </div>

      <div className="preview-track-wrapper">
        <div 
          className="preview-track" 
          ref={trackRef}
          style={{ background: gradientString }}
          onDoubleClick={handleTrackDoubleClick}
        >
          {/* Draggable Stop Pins */}
          {stops.map((stop) => {
            const isActive = stop.id === activeStopId;
            return (
              <div 
                key={stop.id}
                className={`stop-pin-wrapper ${isActive ? 'active' : ''}`}
                style={{ left: `${stop.position}%` }}
                onMouseDown={(e) => handleMouseDown(stop.id, e)}
                onTouchStart={(e) => handleTouchStart(stop.id, e)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStop(stop.id);
                }}
              >
                <div 
                  className="stop-pin-tooltip"
                  style={{ backgroundColor: stop.color }}
                >
                  <span className="tooltip-color-text">{stop.color}</span>
                  <span className="tooltip-pos-text">{Math.round(stop.position)}%</span>
                </div>
                <div 
                  className="stop-pin-handle"
                  style={{ backgroundColor: stop.color }}
                >
                  <div className="stop-pin-inner"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .preview-card {
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .preview-title {
          font-weight: 700;
          color: var(--text-primary);
        }

        .preview-tip {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .preview-track-wrapper {
          position: relative;
          padding: 1.5rem 0.75rem 1.75rem; /* give space for tooltip and pins */
        }

        .preview-track {
          height: 3.5rem;
          border-radius: var(--radius-md);
          position: relative;
          box-shadow: inset 0 0 0 1px var(--border-color), inset 0 2px 10px rgba(0, 0, 0, 0.15), var(--shadow-sm);
          cursor: pointer;
          user-select: none;
          background-clip: padding-box;
        }

        .stop-pin-wrapper {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          cursor: grab;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.1s;
        }

        .stop-pin-wrapper:active {
          cursor: grabbing;
        }

        .stop-pin-wrapper.active {
          z-index: 10;
        }

        .stop-pin-handle {
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s, border-color 0.2s;
        }

        .stop-pin-wrapper.active .stop-pin-handle {
          border-color: var(--accent-primary);
          transform: scale(1.2);
          box-shadow: 0 6px 14px rgba(0,0,0,0.4), 0 0 0 3px var(--accent-primary-glow);
        }

        .stop-pin-inner {
          width: 0.5rem;
          height: 0.5rem;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
        }

        /* Pin tooltip */
        .stop-pin-tooltip {
          position: absolute;
          bottom: 125%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.3rem 0.5rem;
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-md), 0 2px 4px rgba(0,0,0,0.15);
          opacity: 0;
          transform: translateY(6px);
          pointer-events: none;
          transition: opacity 0.2s, transform 0.2s;
          border: 1px solid rgba(255,255,255,0.25);
          text-align: center;
        }

        .stop-pin-wrapper:hover .stop-pin-tooltip,
        .stop-pin-wrapper.active .stop-pin-tooltip {
          opacity: 1;
          transform: translateY(0);
        }

        .tooltip-color-text {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
          line-height: 1;
        }

        .tooltip-pos-text {
          font-size: 0.65rem;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
          margin-top: 0.15rem;
          line-height: 1;
        }

        @media (max-width: 576px) {
          .preview-tip {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
