import { useState, useRef, useEffect } from "react";

const RangeSliderWithTooltip = ({ maxPrice, minPrice, handlePriceChange }) => {
  const [sliderValue, setSliderValue] = useState(maxPrice);
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const rangeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); // State to track if user is interacting with the slider

  // Handle slider change
  const handleSliderChange = (e) => {
    const value = Math.floor(e.target.value);
    setSliderValue(value);
    updateTooltipPosition(value);
    handlePriceChange(value);
  };

  // Update tooltip position based on slider value
  const updateTooltipPosition = (value) => {
    if (rangeRef.current) {
      const rangeWidth = rangeRef.current.offsetWidth;
      const percent = (value / maxPrice) * 100;
      const newPosition = (rangeWidth * percent) / 100;
      setTooltipPosition(newPosition);
    }
  };

  // Update position initially or on component render
  useEffect(() => {
    updateTooltipPosition(sliderValue);
  }, [sliderValue, maxPrice]);

  // Handle mouse down (start dragging)
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  // Handle mouse up (stop dragging)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse leaving the slider
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full">
      {/* Tooltip positioned based on the slider thumb */}
      {isDragging && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-8 bg-gray-700 text-white text-sm px-2 py-1 rounded"
          style={{ left: `${tooltipPosition}px` }}
        >
          {sliderValue}
        </div>
      )}

      {/* Slider input */}
      <input
        ref={rangeRef}
        type="range"
        min={minPrice}
        max={maxPrice}
        step="any"
        value={sliderValue}
        onChange={handleSliderChange}
        onMouseDown={handleMouseDown} // Show tooltip when clicking or dragging
        onMouseUp={handleMouseUp} // Hide tooltip when releasing mouse
        onMouseLeave={handleMouseLeave} // Hide tooltip when mouse leaves slider area
        className="w-full"
      />
    </div>
  );
};

export default RangeSliderWithTooltip;
