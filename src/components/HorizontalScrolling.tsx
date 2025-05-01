import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Props = {
  renderList: Object[];
  SingleItem: ({ item, i }: { item: Object; i: number }) => React.ReactNode;
};

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
}

const HorizontalScrolling = ({ renderList, SingleItem }: Props) => {
  const settings = {
    className: "slider variable-width",
    dots: true,
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
