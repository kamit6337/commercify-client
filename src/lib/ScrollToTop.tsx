import Icons from "@/assets/icons";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed z-40 right-0 bottom-0 mr-10 mb-10">
      {isVisible && (
        <p
          className="text-2xl border rounded-full p-3 bg-foreground text-background cursor-pointer"
          onClick={scrollToTop}
        >
          <Icons.upArrow />
        </p>
      )}
    </div>
  );
};

export default ScrollToTop;
