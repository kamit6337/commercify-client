/* eslint-disable react/prop-types */

const Loading = ({ hScreen = false, small = false }) => {
  return (
    <div
      className={`w-full flex justify-center items-center`}
      style={{ height: `${hScreen ? "100vh" : "100%"}` }}
    >
      <div className={small ? "small_loading" : "loading"} />
    </div>
  );
};

export default Loading;
