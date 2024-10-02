import { Link, Outlet } from "react-router-dom";
import useAllCategory from "../hooks/query/useAllCategory";
import { useState } from "react";
import HorizontalScrolling from "../lib/HorizontalScrolling";
import Loading from "../containers/Loading";

const HomeLayout = () => {
  const { data: allCategory, isLoading, error } = useAllCategory();
  const [optionIndex, setOptionIndex] = useState(null);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <HorizontalScrolling
        height={125}
        show_bg_color={true}
        sideMargin={50}
        inBetweenGap={50}
      >
        {allCategory.length > 0 ? (
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
            {allCategory.map((category, i) => {
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
