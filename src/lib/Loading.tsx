type HEIGHT = "full" | 96;

type Props = {
  height?: HEIGHT;
  small?: boolean; // in pixels
  color?: string; // any Tailwind text color, e.g., "text-blue-500"
};

const Loading = ({ height, small = false, color = "text-blue-500" }: Props) => {
  const spinnerStyle = {
    width: small ? "20px" : "40px",
    height: small ? "20px" : "40px",
  };

  return (
    <div
      className="w-full flex justify-center items-center"
      style={{ height: height === "full" ? "100%" : "500px" }}
    >
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
        style={spinnerStyle}
      />
    </div>
  );
};

export default Loading;
