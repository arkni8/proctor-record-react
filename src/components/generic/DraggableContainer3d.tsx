import React, { useState, useRef, useEffect } from 'react';

type Props = {
  gridSize?: number;
  children: React.ReactNode;
};

const originalPosition = {
  x: 100,
  y: 100
};

export function DraggableContainer3d({ gridSize = 20, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const originalPositionRef = useRef({ x: originalPosition.x, y: originalPosition.y });
  const lastTransformRef = useRef({ x: 0, y: 0 });
  const [contract, setContract] = useState(false);

  const snapToGrid = (value: number) => Math.round(value / gridSize) * gridSize;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const leftBound = containerRef.current!.offsetLeft + lastTransformRef.current.x;
    const topBound = containerRef.current!.offsetTop + lastTransformRef.current.y;
    dragStartRef.current = {
      x: e.clientX - leftBound,
      y: e.clientY - topBound
    };
    originalPositionRef.current = {
      x: leftBound,
      y: topBound
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - originalPositionRef.current.x - dragStartRef.current.x;
    const dy = e.clientY - originalPositionRef.current.y - dragStartRef.current.y;

    // console.log(dx, dy, e.clientX, e.clientY, originalPositionRef.current, dragStartRef.current);

    containerRef.current!.style.transform = `translate3d(${dx + lastTransformRef.current.x}px, ${dy + lastTransformRef.current.y}px, 0)`;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    // if (!containerRef.current!.style.transform) return;

    // const finalX = originalPositionRef.current.x + parseFloat(containerRef.current!.style.transform.split('(')[1]);
    let finalX = parseFloat(containerRef.current!.style.transform.split('(')[1]);
    // const finalY = originalPositionRef.current.y + parseFloat(containerRef.current!.style.transform.split(',')[1]);
    let finalY = parseFloat(containerRef.current!.style.transform.split(',')[1]);

    // console.log("ping", finalX, finalY, containerRef.current!.style.transform);

    setIsDragging(false);

    const maxX = window.innerWidth;
    const maxY = window.innerHeight;

    if (finalX + originalPosition.x < 0) {
      finalX = -originalPosition.x;
    }
    if (finalY + originalPosition.y < 0) {
      finalY = -originalPosition.y;
    }
    if (finalX + originalPosition.x > maxX - 100) {
      finalX = maxX - originalPosition.x - 340;
    }
    if (finalY + originalPosition.y > maxY - 100) {
      finalY = maxY - originalPosition.y - 280;
    }

    if (containerRef.current) {
      lastTransformRef.current = {
        x: finalX,
        y: finalY
      };
      containerRef.current!.style.transform = `translate3d(${snapToGrid(finalX)}px, ${snapToGrid(finalY)}px, 0)`;
      containerRef.current.style.transition = "all 380ms cubic-bezier(.42,.97,.52,1.49)";
      containerRef.current.style.transitionProperty = "transform";

      // requestAnimationFrame(() => {
      // setPosition({
      //   x: newX,
      //   y: newY
      // });

      // console.log(containerRef.current?.style.transitionProperty);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // containerRef.current!.style.transform = ``;
          containerRef.current!.style.transition = "";
          containerRef.current!.style.transitionProperty = "";
        });
      });
      // });
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="fixed cursor-move bg-slate-900 rounded-lg shadow-lg"
      style={{
        left: `${originalPosition.x}px`,
        top: `${originalPosition.y}px`,
        userSelect: 'none',
        transform: `translate3d(0,0,0)`, // Force GPU acceleration
        willChange: "transform"
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute z-30 rounded-t-lg p-2 w-52">
        <span className='text-xs whitespace-nowrap'>Webcam Preview</span>
        <button
          className='ml-2 text-xs border rounded-md p-1 leading-none'
          onClick={() => setContract(prev => !prev)}
        >{contract ? "+" : "X"}</button>
      </div>
      <div className={"relative rounded-xl overflow-clip" + (contract ? " hidden" : "")}>
        {children}
      </div>
    </div>
  );
};

export default DraggableContainer3d;