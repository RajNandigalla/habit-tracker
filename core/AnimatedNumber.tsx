import React, { useState, useEffect, useRef } from 'react';

const AnimatedNumber: React.FC<{ value: number; format: (val: number) => string }> = ({
  value,
  format,
}) => {
  // Always start the display value at 0. When the component mounts (or re-mounts on page switch),
  // this state is reset, which is key to re-triggering the animation.
  const [displayValue, setDisplayValue] = useState(0);

  // A ref to hold the previous value prop. This is used to animate from the old number to the new one if the value changes.
  const prevValueRef = useRef(0);

  // A ref to hold the requestAnimationFrame ID so we can cancel it on cleanup.
  // Fix: Initialize useRef with null and update type to handle null value.
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // On mount, prevValueRef.current is 0. On subsequent updates, it will be the previous `value`.
    const startValue = prevValueRef.current;
    const endValue = value;

    // No need to animate if the value hasn't changed.
    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    // Cancel any existing animation frame to avoid conflicts.
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const animationDuration = 500; // ms
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Using an "ease-out" function for a smoother stop.
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentVal = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(currentVal);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Ensure the final value is set exactly once the animation is complete.
      setDisplayValue(endValue);
    };

    // Start the animation.
    animationFrameRef.current = requestAnimationFrame(animate);

    // This cleanup function runs when the component unmounts or when the `value` prop changes.
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Update the ref with the current value. When the effect re-runs for a new `value`,
      // `startValue` will correctly be the value from the previous render.
      prevValueRef.current = value;
    };
  }, [value]); // The effect re-runs only when the target `value` changes.

  return <>{format(displayValue)}</>;
};

export default AnimatedNumber;
