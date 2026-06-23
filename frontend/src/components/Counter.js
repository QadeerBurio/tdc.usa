import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const numberMatch = value.match(/\d+/);
    if (!numberMatch) {
      setCount(value);
      return;
    }

    const target = parseInt(numberMatch[0], 10);
    const suffix = value.replace(numberMatch[0], '');

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const current = Math.floor(progress * target);
      setCount(`${current}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count || `0${value.replace(/\d+/, '')}`}</span>;
};

export default Counter;
