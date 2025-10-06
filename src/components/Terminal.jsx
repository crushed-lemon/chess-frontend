import React, { useEffect, useRef } from "react";

export default function Terminal({ ps1 = "$", lines = [] }) {
  const containerRef = useRef(null);

  // Auto-scroll to bottom whenever new lines are added or updated
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-xl shadow-lg w-full max-w-md font-mono text-sm text-amber-200 overflow-hidden">
      
      {/* Header bar with traffic-light dots */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-700 border-b border-gray-600 rounded-t-xl">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-auto text-amber-300 text-xs italic opacity-80 select-none">
          chess-terminal
        </span>
      </div>

      {/* Content area */}
      <div
        ref={containerRef}
        className="p-4 space-y-1 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
      >
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">
            <span className="text-amber-400">{ps1} </span>
            <span>{line}</span>
            {idx === lines.length - 1 && 
              <span className="animate-blink">█</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
