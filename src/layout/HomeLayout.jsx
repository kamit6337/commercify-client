import { Link, Outlet } from "react-router-dom";
import useAllCategory from "../hooks/query/useAllCategory";
import { useEffect, useRef, useState } from "react";
import { Icons } from "../assets/icons";

const HomeLayout = () => {
  const scrollPixel = 500;
  const ref = useRef(null);
  const { data: allCategory } = useAllCategory();
  const [widthDiff, setWidthDiff] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
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
    <>
      <div className="flex items-center h-32 relative">
        <div className="relative flex-1 flex items-center mx-14" ref={ref}>
          <div
            className="absolute flex gap-10"
            style={{ transform: `translateX(${index}px)` }}
          >
            {allCategory.data.length > 0 ? (
              allCategory.data.map((category, i) => {
                const { _id, title } = category;

                return (
                  <div key={i} className="whitespace-nowrap">
                    <Link to={`/category/${_id}`}>
                      <p className="uppercase">{title}</p>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div>No Category available</div>
            )}
          </div>
        </div>
        <p
          className="absolute h-full left-0  bg-slate-300 cursor-pointer  flex items-center px-1 text-slate-800 text-3xl"
          onClick={moveLeft}
        >
          <Icons.leftArrow />
        </p>
        <p
          className="absolute h-full right-0 bg-slate-300 cursor-pointer  flex items-center px-1 text-slate-800 text-3xl"
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
