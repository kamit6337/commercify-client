import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactIcons from "@/assets/icons";

type Props = {
  renderList: Object[];
  SingleItem: ({ item, i }: { item: Object; i: number }) => React.ReactNode;
};

function SampleNextArrow(props: React.HTMLProps<HTMLButtonElement>) {
  const { onClick } = props;
  return (
    <button
      className="absolute left-full top-1/2 -translate-y-1/2 p-2 border rounded-full hover:bg-bg_bg"
      onClick={onClick}
    >
      <ReactIcons.rightArrow />
    </button>
  );
}

function SamplePrevArrow(props: React.HTMLProps<HTMLButtonElement>) {
  const { onClick } = props;
  return (
    <button
      className="absolute right-full top-1/2 -translate-y-1/2 p-2 border rounded-full hover:bg-bg_bg"
      onClick={onClick}
    >
      <ReactIcons.leftArrow />
    </button>
  );
}

const HorizontalScrolling = ({ renderList, SingleItem }: Props) => {
  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  if (!renderList || renderList.length === 0) return;

  return (
    <div className="slider-container w-full px-10">
      <Slider {...settings}>
        {renderList.map((item, i) => {
          return <SingleItem item={item} i={i} />;
        })}
      </Slider>
    </div>
  );
};

export default HorizontalScrolling;
