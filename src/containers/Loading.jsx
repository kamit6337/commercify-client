/* eslint-disable react/prop-types */

const Loading = ({ hScreen = false }) => {
  return (
    <div
      className={`w-full flex justify-center items-center`}
      style={{ height: `${hScreen ? "100vh" : "100%"}` }}
    >
      <div className="loading" />
    </div>
  );
};

export default Loading;
