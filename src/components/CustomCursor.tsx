import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, [role="button"], input, textarea, select')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, [role="button"], input, textarea, select')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        className={`fixed top-0 left-0 w-4 h-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-150 ${
          isClicking ? 'scale-75' : isHovering ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transform: `translate(${position.x - 8}px, ${position.y - 8}px) scale(${
            isClicking ? 0.75 : isHovering ? 1.5 : 1
          })`,
        }}
      />
      
      {/* Cursor trail */}
      <div
        className={`fixed top-0 left-0 w-8 h-8 border-2 border-primary-500/50 rounded-full pointer-events-none z-[9998] transition-all duration-300 ${
          isHovering ? 'scale-200 border-accent-500/50' : 'scale-100'
        }`}
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px)`,
        }}
      />
    </>
  );
};

export default CustomCursor;