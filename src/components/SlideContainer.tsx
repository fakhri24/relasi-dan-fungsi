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
    <main className="no-print flex-1 flex flex-col justify-center items-center p-4 md:p-8 w-full max-w-7xl mx-auto min-h-[calc(100vh-65px)]">
      <div className="w-full h-full bg-slate-950/60 rounded-3xl p-4 md:p-8 flex flex-col justify-between">
        {children}
      </div>
    </main>
  );
};
