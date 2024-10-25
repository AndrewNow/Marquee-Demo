"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | undefined;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

function MarqueeContent({ text, textClass }: { text: string, textClass?: string }) {
  const textContainerRef = useRef<HTMLSpanElement>(null);
  const overflowContainerRef = useRef<HTMLDivElement>(null);
  const [delta, setDelta] = useState(0);

  const calculateDelta = useCallback(() => {
    if (textContainerRef.current && overflowContainerRef.current) {
      const textWidth = textContainerRef.current.offsetWidth;
      const overflowWidth = overflowContainerRef.current.offsetWidth;
      setDelta(textWidth - overflowWidth);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let animationFrameId: number;
    let timeoutId: number;
    let isMovingLeft = true;

    const startAnimation = () => {
      const duration = 4000;
      const pause = 2500;
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!textContainerRef.current) return; 

        if (!startTime) startTime = timestamp;
       
        const elapsed = timestamp - startTime;

        if (elapsed < duration) {
          const progress = elapsed / duration;
          const translateX = isMovingLeft ? -delta * progress : -delta * (1 - progress);
          textContainerRef.current.style.transform = `translateX(${translateX}px)`;
          animationFrameId = requestAnimationFrame(animate);
        } else {
          const finalTranslateX = isMovingLeft ? -delta : 0;
          textContainerRef.current.style.transform = `translateX(${finalTranslateX}px)`;
          timeoutId = window.setTimeout(() => {
            isMovingLeft = !isMovingLeft;
            startTime = null;
            animationFrameId = requestAnimationFrame(animate);
          }, pause);
        }
      };

      if (delta > 0) animationFrameId = requestAnimationFrame(animate);
    };

    startAnimation();

    const resizeObserver = new ResizeObserver(debounce(() => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
      calculateDelta();  
      startAnimation();
    }, 500));

    if (overflowContainerRef.current) {
      resizeObserver.observe(overflowContainerRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [delta, calculateDelta]);

  useEffect(() => {
    calculateDelta();
  }, [text, calculateDelta]);

  return (
    <div
      className="w-full bg-stone-200 whitespace-nowrap"
      ref={overflowContainerRef}
    >
      <span
        className={textClass && textClass}
        ref={textContainerRef}
        style={{ transform: 'translateX(0)' }}
      >
        {text}
      </span>
    </div>
  );
}

export default function Marquee({ text, textClass, parentClass }: { text: string, textClass?: string, parentClass?: string }) {
  return (
    <div className={parentClass && parentClass} suppressHydrationWarning>
      <MarqueeContent text={text} textClass={textClass} />
    </div>
  );
}
