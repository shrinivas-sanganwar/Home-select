import React from 'react';

/**
 * AuroraBackground
 * Renders a subtle, heavily blurred Aurora light effect exclusively behind the Hero section.
 * Adapts beautifully between light (#F8F4EC) and dark (#0E131F) modes with glassmorphic depth.
 */
export const AuroraBackground: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
      aria-hidden="true"
    >
      {/* Base warm/dark background blend anchor */}
      <div className="absolute inset-0 bg-[#F8F4EC] dark:bg-[#0E131F] opacity-90 transition-colors duration-300" />

      {/* Aurora Organic Soft Glowing Blobs */}
      <div className="absolute -top-[10%] left-[15%] w-[450px] h-[350px] sm:w-[600px] sm:h-[450px] rounded-full bg-[#243B7A] dark:bg-[#3B82F6] opacity-[0.22] dark:opacity-[0.28] blur-[110px] sm:blur-[140px] animate-aurora-1" />
      
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[320px] sm:w-[550px] sm:h-[420px] rounded-full bg-[#E68A00] dark:bg-[#F59E0B] opacity-[0.22] dark:opacity-[0.26] blur-[100px] sm:blur-[130px] animate-aurora-2" />
      
      <div className="absolute top-[35%] left-[25%] w-[420px] h-[300px] sm:w-[580px] sm:h-[380px] rounded-full bg-[#3F8F6B] dark:bg-[#10B981] opacity-[0.20] dark:opacity-[0.24] blur-[105px] sm:blur-[135px] animate-aurora-3" />
      
      <div className="absolute top-[20%] right-[28%] w-[380px] h-[280px] sm:w-[500px] sm:h-[350px] rounded-full bg-[#D96C4A] dark:bg-[#F97316] opacity-[0.18] dark:opacity-[0.22] blur-[95px] sm:blur-[125px] animate-aurora-4" />

      {/* Gentle center glow balance */}
      <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-r from-[#E68A00]/10 via-[#243B7A]/10 to-[#3F8F6B]/10 dark:from-[#F59E0B]/15 dark:via-[#3B82F6]/15 dark:to-[#10B981]/15 blur-[130px]" />
    </div>
  );
};
