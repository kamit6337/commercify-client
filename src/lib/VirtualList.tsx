import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface VirtualListProps<T> {
  items: T[];
  itemHeight?: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  containerClassName?: string;
  contentClassName?: string;
}

function VirtualList<T>({
  items,
  itemHeight = 50,
  overscan = 5,
  renderItem,
  containerClassName = "h-80 overflow-y-auto",
  contentClassName = "",
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  return (
    <div ref={parentRef} className={containerClassName}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
        className={contentClassName}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              className="virtual-row"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
                willChange: "transform", // ✅ critical for GPU acceleration
              }}
            >
              {renderItem(item, virtualRow.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VirtualList;
