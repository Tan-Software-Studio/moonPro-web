'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TextTriangle from '../../../public/assets/common/text-triangle.svg';
import Image from 'next/image';
import React from 'react';

export default function Tooltip({ body, children }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState('top');
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const floatingRef = useRef(null);
  let hoverTimeout;

  const updatePosition = () => {
    if (!triggerRef.current || !floatingRef.current) return;

    requestAnimationFrame(() => {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = floatingRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const elementHeight = tooltipRect.height;
      const elementWidth = tooltipRect.width;

      const spaceAbove = rect.top;
      const preferred = spaceAbove >= elementHeight + 10 ? 'top' : 'bottom';

      let left = centerX;

      const padding = 8;
      const potentialLeft = centerX - elementWidth / 2;
      const potentialRight = centerX + elementWidth / 2;

      if (potentialLeft < padding) {
        left = padding + elementWidth / 2;
      } else if (potentialRight > window.innerWidth - padding) {
        left = window.innerWidth - padding - elementWidth / 2;
      }

      setPosition(preferred);
      setCoords({
        top: preferred === 'top' ? rect.top - elementHeight : rect.bottom,
        left,
      });
    });
  };

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      setShow(true);
      updatePosition();
    }, 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      setShow(false);
    }, 100);
  };

  useEffect(() => {
    let animationFrame;
    if (show) {
      animationFrame = requestAnimationFrame(() => {
        updatePosition();
      });
    }
    return () => {
      clearTimeout(hoverTimeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [show]);

  // 🧙 Clone child to inject tooltip trigger behavior + styles
  const child = React.isValidElement(children)
  ? React.cloneElement(children, {
      ref: triggerRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      className: `${children.props.className ?? ''}`,
    })
  : children; // fallback — just render it raw if it's not a React element

  return (
    <>
      {child}

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
                className="fixed z-[9999999] max-w-[320px] flex flex-col items-center"
                style={{
                  top: position === 'top' ? coords.top - 2 : coords.top + 2,
                  left: coords.left,
                  transform: 'translateX(-50%)',
                }}
              >
                {position === 'bottom' && (
                  <Image
                    src={TextTriangle}
                    alt="Text Triangle"
                    width={12}
                    height={6}
                    className="rotate-180 shadow-2xl"
                  />
                )}

                <div className="bg-[#1F1F1F] text-[12px] font-bold leading-3 text-[#FFFFFF] rounded-[4px] p-2 flex flex-col justify-start gap-1 onest shadow-2xl">
                  <p className="font-normal">{body}</p>
                </div>

                {position === 'top' && (
                  <Image
                    src={TextTriangle}
                    alt="Text Triangle"
                    width={12}
                    height={6}
                    className="shadow-2xl"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
