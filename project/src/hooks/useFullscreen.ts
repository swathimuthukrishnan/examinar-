import { useState, useEffect } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenExits, setFullscreenExits] = useState(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      
      // If we were in fullscreen and now we're not, increment exit count
      if (isFullscreen && !isCurrentlyFullscreen) {
        setFullscreenExits(prev => prev + 1);
      }
      
      setIsFullscreen(isCurrentlyFullscreen);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F11 and other fullscreen exit keys during test
      if (e.key === 'F11' || (e.key === 'Escape' && isFullscreen)) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const enterFullscreen = async (): Promise<boolean> => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      return false;
    }
  };

  const exitFullscreen = async (): Promise<boolean> => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
      return false;
    }
  };

  return {
    isFullscreen,
    fullscreenExits,
    enterFullscreen,
    exitFullscreen,
    resetExitCount: () => setFullscreenExits(0)
  };
};