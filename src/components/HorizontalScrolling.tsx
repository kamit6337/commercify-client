import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Props = {
  renderList: Object[];
  SingleItem: ({ item, i }: { item: Object; i: number }) => React.ReactNode;
};

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
  };

  if (!renderList || renderList.length === 0) return;

  return (
    <Slider {...settings}>
      {renderList.map((item, i) => {
        return <SingleItem item={item} i={i} />;
      })}
    </Slider>
  );
};

export default HorizontalScrolling;
