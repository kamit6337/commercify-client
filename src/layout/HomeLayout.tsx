import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import Loading from "@/lib/Loading";
import useAllCategory from "@/hooks/category/useAllCategory";
import HorizontalScrolling from "@/components/HorizontalScrolling";
import { CATEGORY } from "@/types";

const HomeLayout = () => {
  const { data, isLoading, error } = useAllCategory();
  const [optionIndex, setOptionIndex] = useState<number | null>(null);

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

  const allCategory = data as CATEGORY[];

  return (
    <>
      <main className="w-full h-20 flex items-center">
        <HorizontalScrolling
          renderList={allCategory}
          SingleItem={({ item, i }) => {
            const { _id, title } = item as CATEGORY;

            return (
              <div className="px-10 h-8" key={_id}>
                <Link to={`/category/${_id}`}>
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
              </div>
            );
          }}
        />
      </main>
      <Outlet />
    </>
  );
};

export default HomeLayout;
