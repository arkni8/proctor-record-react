import React, { useState, useRef, useEffect } from 'react';

type Props = {
  gridSize?: number;
  children: React.ReactNode;
};

export function DraggableContainer({ gridSize = 20, children }: Props) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  // const [targetPosition, setTargetPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // const videoRef = useRef(null);
  // const animationFrameRef = useRef<number | null>();
  const containerRef = useRef<HTMLDivElement>(null);

  const snapToGrid = (value: number) => Math.round(value / gridSize) * gridSize;

  // const interpolate = (current: number, target: number, factor = 0.15) => {
  //   return current + (target - current) * factor;
  // };

  // const animate = () => {
  //   setPosition(prev => ({
  //     x: interpolate(prev.x, targetPosition.x),
  //     y: interpolate(prev.y, targetPosition.y)
  //   }));

  //   if (Math.abs(position.x - targetPosition.x) > 0.1 ||
  //     Math.abs(position.y - targetPosition.y) > 0.1) {
  //     animationFrameRef.current = requestAnimationFrame(animate);
  //   }
  // };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    // if (animationFrameRef.current) {
    //   cancelAnimationFrame(animationFrameRef.current);
    // }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      // const newX = snapToGrid(e.clientX - offset.x);
      // const newY = snapToGrid(e.clientY - offset.y);
      // setTargetPosition({ x: newX, y: newY });
      // console.log("um?", e.clientX, offset.x);
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });

      // if (!animationFrameRef.current) {
      //   animationFrameRef.current = requestAnimationFrame(animate);
      // }
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    setIsDragging(false);
    let newX = snapToGrid(e.clientX - offset.x);
    let newY = snapToGrid(e.clientY - offset.y);

    const maxX = window.innerWidth;
    const maxY = window.innerHeight;

    if (newX < 0) {
      newX = 0;
    }
    if (newY < 0) {
      newY = 0;
    }
    if (newX > maxX - 40) {
      newX = snapToGrid(maxX - 40);
    }
    if (newY > maxY - 40) {
      newY = snapToGrid(maxY - 80);
    }

    if (containerRef.current) {
      // containerRef.current.style.transition = "all 180ms cubic-bezier(.25,.75,.5,1.25)";
      containerRef.current.style.transition = "all 180ms cubic-bezier(.42,.97,.52,1.49)";
      containerRef.current.style.transitionProperty = "top, left";

      requestAnimationFrame(() => {
        setPosition({
          x: newX,
          y: newY
        });

        // console.log(containerRef.current?.style.transitionProperty);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            containerRef.current!.style.transition = "";
            containerRef.current!.style.transitionProperty = "";
          });
        });
      });
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
      // if (animationFrameRef.current) {
      //   cancelAnimationFrame(animationFrameRef.current);
      // }
    };
  }, [isDragging, offset]);

  return (
    <div
      ref={containerRef}
      className="fixed cursor-move bg-slate-700 rounded-lg shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        // width: '320px',
        userSelect: 'none',
        transform: `translate3d(0,0,0)`, // Force GPU acceleration
        // transition: "all 500ms linear",
        // transitionProperty: "top left"
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="p-2 bg-slate-900 rounded-t-lg">
        Webcam Preview
      </div>
      {children}
    </div>
  );
};

export default DraggableContainer;