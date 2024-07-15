/* eslint-disable react/prop-types */
import { useLayoutEffect, useRef, useState } from "react";
import { Icons } from "../assets/icons";

const HorizontalScrolling = ({
  children,
  cursorClassName,
  scrollLength = 500,
  height = 400,
  duration = 500,
}) => {
  const scrollPixel = scrollLength;
  const ref = useRef(null);
  const [widthDiff, setWidthDiff] = useState(null);
  const [index, setIndex] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      const width = ref.current.clientWidth;
      const scrollWidth = ref.current.scrollWidth;
      setWidthDiff(scrollWidth - width);
    }
  }, []);

  const moveRight = () => {
    if (!widthDiff || widthDiff <= 0) return;
    if (widthDiff >= scrollPixel) {
      setIndex((prev) => prev - scrollPixel);
      setWidthDiff((prev) => prev - scrollPixel);
      return;
    }

    setIndex((prev) => prev - widthDiff);
    setWidthDiff((prev) => prev - widthDiff);
  };

  const moveLeft = () => {
    if (!index || index >= 0) return;

    const positiveIndex = index * -1;

    if (positiveIndex >= scrollPixel) {
      setIndex((prev) => prev + scrollPixel);
      setWidthDiff((prev) => prev + scrollPixel);
      return;
    }
    setIndex((prev) => prev + positiveIndex);
    setWidthDiff((prev) => prev + positiveIndex);
  };

  return (
    <div
      className="flex items-center my-10 relative"
      style={{ height: `${height}px` }}
    >
      <div className="relative flex-1 flex mx-10 tablet:mx-5" ref={ref}>
        <div
          className={`absolute h-full flex items-center gap-5 duration-${duration}`}
          style={{ transform: `translateX(${index}px)` }}
        >
          {children}
        </div>
      </div>
      <p
        className={`absolute h-full left-0  hover:scale-125 duration-300 cursor-pointer  flex items-center px-1 tablet:px-0 text-slate-800 text-3xl ${cursorClassName}`}
        onClick={moveLeft}
      >
        <Icons.leftArrow />
      </p>
      <p
        className={`absolute h-full right-0  hover:scale-125 duration-300 cursor-pointer  flex items-center px-1 tablet:px-0 text-slate-800 text-3xl ${cursorClassName}`}
        onClick={moveRight}
      >
        <Icons.rightArrow />
      </p>
    </div>
  );
};

export default HorizontalScrolling;
