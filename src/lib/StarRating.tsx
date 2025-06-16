import ReactIcons from "@/assets/icons";

type Props = {
  rate: number;
  isClick?: boolean;
  onClick?: (key: number) => void;
};

const StarRating = ({ rate, isClick = false, onClick = () => {} }: Props) => {
  const rateValue = Math.floor(rate);
  let fraction = rate - rateValue;
  fraction = parseFloat(fraction.toFixed(2));

  return (
    <div className="flex text-2xl h-10">
      {Array.from({ length: 5 }).map((_VALUE, i) => {
        if (i < rateValue) {
          return (
            <p
              key={i}
              className={`${
                isClick ? "cursor-pointer hover:text-3xl" : ""
              } w-8 flex items-center justify-center`}
              onClick={() => isClick && onClick(i + 1)}
            >
              <ReactIcons.star className="text-yellow-300" />
            </p>
          );
        }

        if (i === rateValue && fraction > 0) {
          return (
            <p
              key={i}
              className={`${
                isClick ? "cursor-pointer hover:text-3xl" : ""
              } w-8 flex items-center justify-center`}
              onClick={() => isClick && onClick(i + 1)}
            >
              <ReactIcons.star_half className="text-yellow-300" />
            </p>
          );
        }

        return (
          <p
            key={i}
            className={`${
              isClick ? "cursor-pointer hover:text-3xl" : ""
            } w-8 flex items-center justify-center`}
            onClick={() => isClick && onClick(i + 1)}
          >
            <ReactIcons.star_empty className="" />
          </p>
        );
      })}
    </div>
  );
};

export default StarRating;
