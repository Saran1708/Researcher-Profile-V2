import React from "react";

export default function ResearchLoader() {
  // Detect system theme preference
  const prefersDark = typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100vw',
        height: '100vh',
        backdropFilter: 'blur(8px)',
        backgroundColor: prefersDark 
          ? 'rgba(0, 0, 0, 0.6)' 
          : 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: '8rem',
          height: '8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Middle pulsating ring */}
        <div
          style={{
            position: 'absolute',
            width: '5rem',
            height: '5rem',
            borderRadius: '50%',
            border: prefersDark
              ? '3px solid rgba(144, 202, 249, 0.7)' 
              : '3px solid rgba(25, 118, 210, 0.7)',
            boxShadow: prefersDark 
              ? '0 0 20px rgba(144, 202, 249, 0.4), inset 0 0 20px rgba(144, 202, 249, 0.1)'
              : '0 0 20px rgba(25, 118, 210, 0.3), inset 0 0 20px rgba(25, 118, 210, 0.1)',
            animation: 'pulse 2s infinite ease-in-out',
          }}
        />
        
        {/* Inner spinning ring */}
        <div
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            border: '4px solid transparent',
            borderTopColor: prefersDark ? '#ab47bc' : '#9c27b0',
            borderRightColor: prefersDark ? '#90caf9' : '#1976d2',
            animation: 'spin 1s linear infinite',
          }}
        />
        
        {/* Graduation cap */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: prefersDark 
              ? 'drop-shadow(0 0 8px rgba(171, 71, 188, 0.6))' 
              : 'drop-shadow(0 0 6px rgba(156, 39, 176, 0.6))',
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          <svg 
            width="26" 
            height="26" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <defs>
              <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={prefersDark ? '#90caf9' : '#1976d2'} />
                <stop offset="100%" stopColor={prefersDark ? '#ab47bc' : '#9c27b0'} />
              </linearGradient>
              <linearGradient id="tasselGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={prefersDark ? '#f48fb1' : '#d32f2f'} />
                <stop offset="100%" stopColor={prefersDark ? '#ffb74d' : '#f57c00'} />
              </linearGradient>
            </defs>
            
            {/* Main cap */}
            <path 
              d="M12 2L3 7l9 5 9-5-9-5z" 
              fill="url(#capGrad)"
              stroke={prefersDark ? '#90caf9' : '#1976d2'}
              strokeWidth="0.5"
            />
            
            {/* Cap board (flat top) */}
            <ellipse 
              cx="12" cy="7" rx="10" ry="2" 
              fill="url(#capGrad)"
              opacity="0.9"
            />
            
            {/* Tassel string */}
            <line 
              x1="16" y1="7" x2="18" y2="12" 
              stroke="url(#tasselGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            
            {/* Tassel end */}
            <circle 
              cx="18" cy="12" r="1.5"
              fill="url(#tasselGrad)"
            />
            
            {/* Small tassel strands */}
            <g stroke="url(#tasselGrad)" strokeWidth="1" strokeLinecap="round">
              <line x1="17" y1="13" x2="17" y2="15" />
              <line x1="18" y1="13.5" x2="18" y2="15.5" />
              <line x1="19" y1="13" x2="19" y2="15" />
            </g>
            
            {/* Button on top */}
            <circle 
              cx="12" cy="6" r="0.8"
              fill={prefersDark ? '#f48fb1' : '#d32f2f'}
            />
            
            {/* Highlight on cap */}
            <ellipse 
              cx="9" cy="6" rx="2" ry="0.8" 
              fill="rgba(255,255,255,0.3)"
            />
          </svg>
        </div>
      </div>

      {/* Custom keyframes */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(0.8);
              opacity: 0.6;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.3;
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
        `}
      </style>
    </div>
  );
}