import ReactIcons from "@/assets/icons";
import { useEffect, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";

// prettier-ignore
type Props<T> = {
  mainWidth? : string
  itemsHeight? : string
  triggerWidth? : string
  itemsWidth? : string
  items: T[];
  itemRenderer: (item: T, index: number, selectItem: () => void) => React.ReactNode;
  triggerRenderer: (selected: T | null) => React.ReactNode;
  onSelect: (item: T) => void;
  initialSelected?: T | null;
};

const VirtualizedSelect = <T,>({
  mainWidth,
  itemsHeight,
  triggerWidth,
  itemsWidth,
  items,
  itemRenderer,
  triggerRenderer,
  onSelect,
  initialSelected = null,
}: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T | null>(initialSelected);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<any>(null);

  const [_, setScrollIndex] = useState(0);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = (direction: "up" | "down") => {
    scrollInterval.current = setInterval(() => {
      setScrollIndex((prev) => {
        const nextIndex =
          direction === "up"
            ? Math.max(prev - 1, 0)
            : Math.min(prev + 1, items.length - 1);
        virtuosoRef.current?.scrollToIndex({
          index: nextIndex,
          behavior: "auto",
        });
        return nextIndex;
      });
    }, 60); // Adjust scroll speed here
  };

  const stopAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <main className={`relative ${mainWidth}`} ref={dropdownRef}>
      <div
        className={`w-60 flex justify-between items-center p-2 bg-background border text-foreground text-sm cursor-default rounded-md ${triggerWidth}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="w-3/4 truncate">{triggerRenderer(selected)}</div>
        <p>{isOpen ? <ReactIcons.upArrow /> : <ReactIcons.downArrow />}</p>
      </div>
      {isOpen && (
        <div
          className={`absolute top-full mt-1 z-50 cursor-default overflow-hidden rounded-md border bg-popover shadow-md ${itemsHeight} ${itemsWidth}`}
          style={{
            width: "15rem", // w-60
            maxHeight: "240px", // h-60
            height: items.length < 6 ? `${items.length * 40}px` : "240px",
          }}
        >
          {items.length > 5 && (
            <p
              className="sticky top-0 z-10 w-full h-5 hover:bg-accent hover:text-accent-foreground flex justify-center items-center"
              onMouseEnter={() => startAutoScroll("up")}
              onMouseLeave={stopAutoScroll}
              onClick={() => {
                virtuosoRef.current?.scrollToIndex({
                  index: 0, // Scroll to top
                  behavior: "auto",
                });
                setScrollIndex(0);
              }}
            >
              <ReactIcons.upArrow />
            </p>
          )}
          <Virtuoso
            ref={virtuosoRef}
            style={{
              height: "calc(100% - 40px)",
              overflowY: "scroll",
              scrollbarWidth: "none",
              msOverflowStyle: "none", // IE 10+
            }}
            data={items}
            itemContent={(index, item) => {
              return (
                <div className="p-2 text-sm hover:bg-accent hover:text-accent-foreground">
                  {itemRenderer(item, index, () => {
                    setSelected(item);
                    onSelect(item);
                    setIsOpen(false);
                  })}
                </div>
              );
            }}
          />

          {items.length > 5 && (
            <p
              className="sticky bottom-0 z-10 w-full h-5 hover:bg-accent hover:text-accent-foreground flex justify-center items-center"
              onMouseEnter={() => startAutoScroll("down")}
              onMouseLeave={stopAutoScroll}
              onClick={() => {
                virtuosoRef.current?.scrollToIndex({
                  index: items.length - 1, // Scroll to bottom
                  behavior: "auto",
                });
                setScrollIndex(items.length - 1);
              }}
            >
              <ReactIcons.downArrow />
            </p>
          )}
        </div>
      )}
    </main>
  );
};

export default VirtualizedSelect;
