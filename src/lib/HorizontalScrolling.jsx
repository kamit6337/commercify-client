/* eslint-disable react/prop-types */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icons } from "../assets/icons";

const HorizontalScrolling = ({
  children,
  scrollLength = 500,
  height,
  duration = 500,
  show_bg_color = false,
  sideMargin = 40,
  inBetweenGap = 20,
}) => {
  const [scrollPixel, setScrollPixel] = useState(scrollLength);

  const ref = useRef(null);
  const [widthDiff, setWidthDiff] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 700) {
        setScrollPixel(300);
      } else {
        setScrollPixel(scrollLength);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      className="flex items-center relative"
      style={{ height: `${height}px` }}
    >
      <div
        className={`relative flex-1 flex`}
        ref={ref}
        style={{
          marginLeft: `${sideMargin}px`,
          marginRight: `${sideMargin}px`,
        }}
      >
        <div
          className={`absolute h-full flex items-center duration-${duration}`}
          style={{
            transform: `translateX(${index}px)`,
            gap: `${inBetweenGap}px`,
          }}
        >
          {children}
        </div>
      </div>
      <div
        className={`
          ${index >= 0 && "hidden"}
          ${show_bg_color && "bg-category_arrow_div"}
          absolute h-full left-0 cursor-pointer flex items-center px-1 text-3xl`}
        onClick={moveLeft}
      >
        <p className="hover:scale-125 duration-300 h-full flex items-center">
          <Icons.leftArrow />
        </p>
      </div>
      <div
        className={`
          ${(!widthDiff || widthDiff <= 0) && "hidden"}
          ${show_bg_color && "bg-category_arrow_div"}

          absolute h-full right-0 cursor-pointer  flex items-center px-1 text-3xl`}
        onClick={moveRight}
      >
        <p className="hover:scale-125 duration-300 h-full flex items-center">
          <Icons.rightArrow />
        </p>
      </div>
    </div>
  );
};

export default HorizontalScrolling;
