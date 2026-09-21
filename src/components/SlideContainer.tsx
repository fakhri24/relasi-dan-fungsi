import React, { useEffect } from 'react';

interface SlideContainerProps {
  children: React.ReactNode;
  onNext: () => void;
  onPrev: () => void;
}

export const SlideContainer: React.FC<SlideContainerProps> = ({
  children,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  return (
    <main className="no-print flex-1 h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] w-full max-w-7xl mx-auto p-2 md:p-4 flex flex-col justify-center items-center overflow-hidden">
      <div className="w-full h-full bg-slate-950/80 rounded-2xl md:rounded-3xl p-3 md:p-6 flex flex-col justify-between overflow-hidden border border-slate-900 shadow-2xl">
        {children}
      </div>
    </main>
  );
};
