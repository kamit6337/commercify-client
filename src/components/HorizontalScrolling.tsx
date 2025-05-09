import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Props = {
  renderList: Object[];
  SingleItem: ({ item, i }: { item: Object; i: number }) => React.ReactNode;
};

function SampleNextArrow(props: React.HTMLProps<HTMLDivElement>) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    >
      next
    </div>
  );
}

function SamplePrevArrow(props: React.HTMLProps<HTMLDivElement>) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        color: "black",
        borderColor: "black",
        borderWidth: "5px",
      }}
      onClick={onClick}
    />
  );
}

const HorizontalScrolling = ({ renderList, SingleItem }: Props) => {
  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 2,
    variableWidth: true,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  if (!renderList || renderList.length === 0) return;

  return (
    <div className="slider-container p-5 w-full">
      <Slider {...settings}>
        {renderList.map((item, i) => {
          return <SingleItem item={item} i={i} />;
        })}
      </Slider>
    </div>
  );
};

export default HorizontalScrolling;
