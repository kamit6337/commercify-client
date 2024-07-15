import { Link, Outlet } from "react-router-dom";
import useAllCategory from "../hooks/query/useAllCategory";
import { useEffect, useRef, useState } from "react";
import { Icons } from "../assets/icons";

const HomeLayout = () => {
  const { data: allCategory } = useAllCategory();
  const [scrollPixel, setScrollPixel] = useState(500);
  const ref = useRef(null);
  const [widthDiff, setWidthDiff] = useState(null);
  const [index, setIndex] = useState(0);
  const [optionIndex, setOptionIndex] = useState(null);

  useEffect(() => {
    if (ref.current) {
      const width = ref.current.clientWidth;
      const scrollWidth = ref.current.scrollWidth;
      setWidthDiff(scrollWidth - width);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 700) {
        setScrollPixel(300);
      } else {
        setScrollPixel(500);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
    <>
      <div className="flex items-center h-32 relative">
        <div className="relative flex-1 flex mx-20" ref={ref}>
          <div
            className="absolute h-full flex items-center gap-10 duration-700"
            style={{ transform: `translateX(${index}px)` }}
          >
            {allCategory.data.length > 0 ? (
              <>
                <Link to={`/`}>
                  <p
                    className={`${
                      optionIndex === 999 && "border-b-2"
                    }  capitalize whitespace-nowrap text-category_text`}
                    onMouseEnter={() => setOptionIndex(999)}
                    onMouseLeave={() => setOptionIndex(null)}
                  >
                    All
                  </p>
                </Link>
                {allCategory.data.map((category, i) => {
                  const { _id, title } = category;

                  return (
                    <Link to={`/category/${_id}`} key={i}>
                      <p
                        className={`${
                          optionIndex === i && "border-b-2"
                        }  capitalize whitespace-nowrap text-category_text`}
                        onMouseEnter={() => setOptionIndex(i)}
                        onMouseLeave={() => setOptionIndex(null)}
                      >
                        {title}
                      </p>
                    </Link>
                  );
                })}
              </>
            ) : (
              <div>No Category available</div>
            )}
          </div>
        </div>
        <p
          className={`
          ${index >= 0 && "hidden"}
          absolute h-full left-0  bg-category_arrow_div cursor-pointer flex items-center px-1 text-3xl`}
          onClick={moveLeft}
        >
          <Icons.leftArrow />
        </p>
        <p
          className={`
          ${(!widthDiff || widthDiff <= 0) && "hidden"}
          absolute h-full right-0 bg-category_arrow_div cursor-pointer  flex items-center px-1 text-3xl`}
          onClick={moveRight}
        >
          <Icons.rightArrow />
        </p>
      </div>
      <Outlet />
    </>
  );
};

export default HomeLayout;
