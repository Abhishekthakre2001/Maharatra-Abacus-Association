import React, { useEffect, useRef, useState } from "react";

const TopAutoCarousel = ({
  items = [],
  interval = 3500,
  className = "",
}) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);

  // 🔁 AUTO SCROLL
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, items.length, interval]);

  // 👆 TOUCH HANDLERS
  const onTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) setIndex((i) => Math.min(i + 1, items.length - 1));
    if (diff < -50) setIndex((i) => Math.max(i - 1, 0));
    setIsPaused(false);
  };

  if (!items.length) return null;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100
        border border-blue-100
        shadow-lg hover:shadow-xl transition-shadow
        ${className}
      `}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* GLASS OVERLAY */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md pointer-events-none" />

      {/* SLIDES */}
      <div
        className="relative z-10 flex transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} className="w-full flex-shrink-0 px-1 py-1">
            {item}
          </div>
        ))}
      </div>

      {/* DOT INDICATORS */}
      {items.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`
                transition-all duration-300
                rounded-full
                ${index === i
                  ? "w-8 h-2 bg-blue-600 shadow-md"
                  : "w-2 h-2 bg-blue-400/60 hover:bg-blue-500"
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopAutoCarousel;
