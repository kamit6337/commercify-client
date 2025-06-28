import { useEffect, useState } from "react";
import Loading from "./Loading";

type Props = {
  onTimeout: () => void;
};

const InitialLoading = ({ onTimeout }: Props) => {
  const [seconds, setSeconds] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      onTimeout(); // Call onTimeout when countdown reaches 0
    }
  }, [seconds, onTimeout]);

  return (
    <div className="w-full h-dvh flex justify-center items-center backdrop-blur-sm p-2">
      <div className="w-full max-w-2xl h-72 border-2 rounded flex flex-col items-center justify-center gap-5 p-5">
        <p className="self-center font-semibold tracking-wider underline">
          Notice
        </p>
        <p>
          This loading is due to Render.com (free instance) which has a initial
          sleep interval of few seconds. Afterthat, it won't delay.
        </p>
        <Loading height={"full"} />
        <p className="self-center">Countdown: {seconds}</p>
      </div>
    </div>
  );
};

export default InitialLoading;
