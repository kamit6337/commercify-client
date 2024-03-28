/* eslint-disable react/prop-types */
const SmallLoading = ({ hScreen = false }) => {
  return (
    <div
      className={`w-full flex justify-center items-center`}
      style={{ height: `${hScreen ? "100vh" : "100%"}` }}
    >
      <div className="small_loading" />
    </div>
  );
};

export default SmallLoading;
