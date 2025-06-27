import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setTimeLeft(initialTime);
    setIsActive(false);
    setIsExpired(false);
  }, [initialTime]);

  const stop = useCallback(() => {
    setIsActive(false);
    setIsExpired(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            setIsExpired(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeLeft,
    isActive,
    isExpired,
    start,
    pause,
    reset,
    stop,
    formatTime: () => formatTime(timeLeft),
    isTimeRunningOut: timeLeft <= 300 // 5 minutes warning
  };
};