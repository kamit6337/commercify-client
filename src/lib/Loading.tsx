const Loading = ({ hScreen = false, small = true }) => {
  return (
    <div
      className={`${
        hScreen ? "h-screen" : "h-full"
      } flex w-full items-center justify-center`}
    >
      <div className={`${small ? "small_loading" : "loading"} `} />
    </div>
  );
};

export default Loading;
