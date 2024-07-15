import { Link, Outlet } from "react-router-dom";
import useAllCategory from "../hooks/query/useAllCategory";
import { useState } from "react";
import HorizontalScrolling from "../lib/HorizontalScrolling";

const HomeLayout = () => {
  const { data: allCategory } = useAllCategory();
  const [optionIndex, setOptionIndex] = useState(null);

  return (
    <>
      <HorizontalScrolling
        height={125}
        show_bg_color={true}
        sideMargin={100}
        inBetweenGap={50}
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
      </HorizontalScrolling>
      <Outlet />
    </>
  );
};

export default HomeLayout;
