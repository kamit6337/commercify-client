/* eslint-disable react/prop-types */

import { useState } from "react";

const ImagePart = ({ images, title }) => {
  const [imageSelected, setImageSelected] = useState(images[0]);

  return (
    <div className=" flex">
      <div className="flex flex-col">
        {images.map((img, i) => {
          return (
            <div
              key={i}
              className="w-20 border p-2"
              onClick={() => setImageSelected(img)}
            >
              <img src={img} alt={i} className="w-full object-cover" />
            </div>
          );
        })}
      </div>
      <div className="border w-full">
        <img src={imageSelected} alt={title} className="w-full object-cover" />
      </div>
    </div>
  );
};

export default ImagePart;
