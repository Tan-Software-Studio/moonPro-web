import { useState, useRef, useEffect } from 'react';

const DraggableModal = ({ isOpen, onClose, children, headerSection }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent text selection and other default behaviors
    setIsDragging(true);
    startPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={`rounded-xl bg-[#18181a] shadow-xl pointer-events-auto transition-opacity duration-500 border border-[#323542] ${
          isDragging ? 'bg-opacity-50' : 'bg-opacity-100'
        }`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div
          ref={dragRef}
          className={`flex justify-between items-center border-b border-[#323542] cursor-move select-none transition-opacity duration-500`}
          onMouseDown={handleMouseDown}
        >
          {headerSection}
          <button
            onClick={onClose}
            className={`text-2xl pr-6 font-bold transition-opacity duration-500`}
          >
            ×
          </button>
        </div>
        <div
          className={`transition-opacity duration-500`}
        >
          <div className={`transition-opacity duration-250`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableModal;