const Loading = ({
  hScreen = false,
  small = false,
  width = small ? "20px" : "40px",
  height = small ? "20px" : "40px",
  borderWidth = small ? "2px" : "3px",
  color = "black",
}) => {
  return (
    <div
      className={`w-full flex justify-center items-center`}
      style={{ height: `${hScreen ? "100vh" : "100%"}` }}
    >
      <div
        className="loading_spinner"
        style={{
          width,
          height,
          borderColor: color,
          borderWidth: borderWidth,
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
        }}
      />
    </div>
  );
};

export default Loading;
