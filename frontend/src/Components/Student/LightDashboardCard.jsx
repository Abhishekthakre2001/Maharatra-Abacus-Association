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

  // 👆 TOUCH HANDLERS (TOP STOP)
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
      className={`relative overflow-hidden rounded-2xl ${className}`}
      onMouseEnter={() => setIsPaused(true)}   // 🛑 STOP on hover
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* SLIDES */}
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} className="w-full flex-shrink-0">
            {item}
          </div>
        ))}
      </div>

      {/* DOTS */}
      {items.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, i) => (
            <span
              key={i}
              onClick={() => setIndex(i)}
              className={`cursor-pointer transition-all rounded-full
                ${index === i
                  ? "w-6 h-2 bg-white shadow"
                  : "w-2 h-2 bg-white/60"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopAutoCarousel;
