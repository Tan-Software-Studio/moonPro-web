'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import InfoCircle from '../../../public/assets/common/info-circle.svg';
import TextTriangle from '../../../public/assets/common/text-triangle.svg';
import Image from 'next/image';

export default function Tooltip({
  iconSize = 16,
  header,
  body,
  ctaText,
  onCtaClick,
}) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState('top');
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);
  const floatingRef = useRef(null);
  let hoverTimeout;

  const updatePosition = () => {
    if (!iconRef.current) return;
  
    requestAnimationFrame(() => {
      const iconRect = iconRef.current.getBoundingClientRect();
      const iconCenterX = iconRect.left + iconRect.width / 2;
    
      const element = floatingRef.current;
      const elementHeight = element?.offsetHeight || 0;
    
      const spaceAbove = iconRect.top;
      // const spaceBelow = window.innerHeight - iconRect.bottom;
    
      let preferred = 'bottom'; // default to bottom now
    
      if (spaceAbove >= elementHeight + 10) {
        // If there's enough space above (with a small margin), prefer top
        preferred = 'top';
      }
    
      setPosition(preferred);
      setCoords({
        top: preferred === 'top' ? iconRect.top - elementHeight : iconRect.bottom,
        left: iconCenterX,
      });
    });
  };
  
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      setShow(true);
      updatePosition();
    }, 500);
  }

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      setShow(false);
    }, 100);
  };

  useEffect(() => {
    if (show) {
      updatePosition();
    }
    return () => clearTimeout(hoverTimeout);
  }, [show]);

  return (
    <>
      <div
        ref={iconRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block cursor-help shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        <Image
          src={InfoCircle}
          alt="Info Icon"
          width={iconSize}
          height={iconSize}
        />
      </div>

      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {show && (
              <motion.div
                ref={floatingRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed z-[9999999] max-w-[320px] flex flex-col items-center cursor-help"
                style={{
                  top: position === 'top' ? coords.top - 2 : coords.top + 2,
                  left: coords.left,
                  transform: `translate(-50%)`,
                }}
              >
                {position === 'bottom' &&
                 <Image
                  src={TextTriangle}
                  alt='Text Triangle'
                  width={12}
                  height={6}
                  className='rotate-180 shadow-2xl'
                />
                }
                <div className='w-full bg-[#1F1F1F] text-[10px] font-bold leading-3 text-[#FFFFFF] rounded-[4px] p-2 flex flex-col justify-start gap-1 onest shadow-2xl'>
                  {header && <h3>{header}</h3>}
                  <p className="font-normal">{body}</p>
                  {ctaText && (
                    <button
                      onClick={onCtaClick}
                      className="text-[#1F73FC] hover:underline items-start text-start"
                    >
                      {ctaText}
                    </button>
                  )}
                </div>
                {position === 'top' &&
                 <Image
                  src={TextTriangle}
                  alt='Text Triangle'
                  width={12}
                  height={6}
                  className='shadow-2xl'
                />
                }
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
