import { useState, useEffect } from 'react';
 // Make sure to import the CSS file

const FollowCursorMessage = ({ show }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`message ${show ? 'show' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      id="FollowCursorMessage"
    >
      Move your cursor left side to get access of menus
    </div>
  );
};

export default FollowCursorMessage;